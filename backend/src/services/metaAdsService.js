const axios = require('axios');
const { MetaAccount, Campaign, AdSet, Ad, AdCreative } = require('../models');

class MetaAdsService {
  constructor() {
    this.baseURL = 'https://graph.facebook.com';
    this.version = 'v19.0'; // Latest stable version
  }

  /**
   * Initialize Meta API client with access token
   */
  getApiClient(accessToken) {
    return axios.create({
      baseURL: `${this.baseURL}/${this.version}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * Test Meta API connection and get account info
   */
  async testConnection(accessToken, adAccountId) {
    try {
      const api = this.getApiClient(accessToken);
      
      // Get ad account information
      const response = await api.get(`/${adAccountId}`, {
        params: {
          fields: 'id,name,account_status,currency,timezone_name,amount_spent,balance,account_id'
        }
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleMetaError(error),
      };
    }
  }

  /**
   * Get user's ad accounts
   */
  async getUserAdAccounts(accessToken) {
    try {
      const api = this.getApiClient(accessToken);
      
      const response = await api.get('/me/adaccounts', {
        params: {
          fields: 'id,name,account_status,currency,timezone_name,amount_spent,balance'
        }
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleMetaError(error),
      };
    }
  }

  /**
   * Sync campaigns from Meta API to local database
   */
  async syncCampaigns(metaAccountId) {
    try {
      const metaAccount = await MetaAccount.findByPk(metaAccountId);
      if (!metaAccount) {
        throw new Error('Meta account not found');
      }

      const api = this.getApiClient(metaAccount.accessToken);
      
      // Get campaigns from Meta API
      const response = await api.get(`/${metaAccount.metaAdAccountId}/campaigns`, {
        params: {
          fields: [
            'id', 'name', 'objective', 'status', 'configured_status',
            'special_ad_categories', 'spend_cap', 'start_time', 'stop_time',
            'created_time', 'updated_time', 'budget_rebalance_flag'
          ].join(','),
          limit: 100
        }
      });

      const metaCampaigns = response.data.data;
      const syncedCampaigns = [];

      for (const metaCampaign of metaCampaigns) {
        // Check if campaign already exists
        let campaign = await Campaign.findOne({
          where: {
            metaCampaignId: metaCampaign.id,
            companyId: metaAccount.companyId
          }
        });

        const campaignData = {
          companyId: metaAccount.companyId,
          metaAccountId: metaAccount.id,
          metaCampaignId: metaCampaign.id,
          name: metaCampaign.name,
          objective: this.mapMetaObjective(metaCampaign.objective),
          status: metaCampaign.configured_status || metaCampaign.status,
          specialAdCategories: metaCampaign.special_ad_categories || [],
          spendCap: metaCampaign.spend_cap ? parseFloat(metaCampaign.spend_cap) : null,
          budgetRebalanceFlag: metaCampaign.budget_rebalance_flag || false,
          startTime: metaCampaign.start_time,
          stopTime: metaCampaign.stop_time,
          lastSyncAt: new Date(),
          syncStatus: 'synced',
          metaData: metaCampaign,
        };

        if (campaign) {
          // Update existing campaign
          await campaign.update(campaignData);
        } else {
          // Create new campaign
          campaign = await Campaign.create(campaignData);
        }

        syncedCampaigns.push(campaign);
      }

      // Update meta account sync status
      await metaAccount.update({
        lastSyncAt: new Date(),
        syncStatus: 'synced',
        errorMessage: null,
      });

      return {
        success: true,
        syncedCount: syncedCampaigns.length,
        campaigns: syncedCampaigns,
      };

    } catch (error) {
      // Update meta account with error
      if (metaAccountId) {
        await MetaAccount.update(
          {
            syncStatus: 'error',
            errorMessage: error.message,
          },
          { where: { id: metaAccountId } }
        );
      }

      return {
        success: false,
        error: this.handleMetaError(error),
      };
    }
  }

  /**
   * Get campaign insights/metrics from Meta API
   */
  async getCampaignInsights(metaAccountId, campaignId, dateRange = 'last_30_days') {
    try {
      const metaAccount = await MetaAccount.findByPk(metaAccountId);
      if (!metaAccount) {
        throw new Error('Meta account not found');
      }

      const campaign = await Campaign.findOne({
        where: { id: campaignId, metaAccountId: metaAccountId }
      });
      
      if (!campaign || !campaign.metaCampaignId) {
        throw new Error('Campaign not found or not synced with Meta');
      }

      const api = this.getApiClient(metaAccount.accessToken);
      
      const response = await api.get(`/${campaign.metaCampaignId}/insights`, {
        params: {
          fields: [
            'impressions', 'clicks', 'spend', 'cpm', 'cpc', 'ctr',
            'actions', 'conversions', 'cost_per_action_type',
            'reach', 'frequency', 'video_play_actions'
          ].join(','),
          date_preset: dateRange,
          level: 'campaign'
        }
      });

      const insights = response.data.data[0] || {};
      
      // Update campaign metrics
      const metricsData = {
        impressions: parseInt(insights.impressions) || 0,
        clicks: parseInt(insights.clicks) || 0,
        spend: parseFloat(insights.spend) || 0,
        cpm: parseFloat(insights.cpm) || 0,
        cpc: parseFloat(insights.cpc) || 0,
        ctr: parseFloat(insights.ctr) || 0,
        reach: parseInt(insights.reach) || 0,
        frequency: parseFloat(insights.frequency) || 0,
        conversions: this.extractConversions(insights.actions),
        conversionRate: this.calculateConversionRate(insights),
        costPerConversion: this.extractCostPerConversion(insights.cost_per_action_type),
        lastSyncAt: new Date(),
      };

      await campaign.update(metricsData);

      return {
        success: true,
        data: metricsData,
      };

    } catch (error) {
      return {
        success: false,
        error: this.handleMetaError(error),
      };
    }
  }

  /**
   * Create a new campaign in Meta Ads
   */
  async createCampaign(metaAccountId, campaignData) {
    try {
      const metaAccount = await MetaAccount.findByPk(metaAccountId);
      if (!metaAccount) {
        throw new Error('Meta account not found');
      }

      const api = this.getApiClient(metaAccount.accessToken);
      
      const metaCampaignData = {
        name: campaignData.name,
        objective: this.mapToMetaObjective(campaignData.objective),
        status: campaignData.status || 'PAUSED',
        special_ad_categories: campaignData.specialAdCategories || [],
      };

      if (campaignData.spendCap) {
        metaCampaignData.spend_cap = Math.round(campaignData.spendCap * 100); // Convert to cents
      }

      if (campaignData.startTime) {
        metaCampaignData.start_time = campaignData.startTime;
      }

      if (campaignData.stopTime) {
        metaCampaignData.stop_time = campaignData.stopTime;
      }

      const response = await api.post(`/${metaAccount.metaAdAccountId}/campaigns`, metaCampaignData);
      
      // Create campaign in local database
      const campaign = await Campaign.create({
        companyId: metaAccount.companyId,
        metaAccountId: metaAccount.id,
        metaCampaignId: response.data.id,
        name: campaignData.name,
        objective: campaignData.objective,
        status: campaignData.status || 'PAUSED',
        specialAdCategories: campaignData.specialAdCategories || [],
        spendCap: campaignData.spendCap,
        startTime: campaignData.startTime,
        stopTime: campaignData.stopTime,
        lastSyncAt: new Date(),
        syncStatus: 'synced',
        metaData: response.data,
      });

      return {
        success: true,
        data: campaign,
      };

    } catch (error) {
      return {
        success: false,
        error: this.handleMetaError(error),
      };
    }
  }

  /**
   * Update campaign in Meta Ads
   */
  async updateCampaign(campaignId, updateData) {
    try {
      const campaign = await Campaign.findByPk(campaignId, {
        include: ['metaAccount']
      });
      
      if (!campaign || !campaign.metaCampaignId) {
        throw new Error('Campaign not found or not synced with Meta');
      }

      const api = this.getApiClient(campaign.metaAccount.accessToken);
      
      const metaUpdateData = {};
      
      if (updateData.name) metaUpdateData.name = updateData.name;
      if (updateData.status) metaUpdateData.status = updateData.status;
      if (updateData.spendCap !== undefined) {
        metaUpdateData.spend_cap = updateData.spendCap ? Math.round(updateData.spendCap * 100) : null;
      }

      // Update in Meta API
      if (Object.keys(metaUpdateData).length > 0) {
        await api.post(`/${campaign.metaCampaignId}`, metaUpdateData);
      }

      // Update local database
      await campaign.update({
        ...updateData,
        lastSyncAt: new Date(),
        syncStatus: 'synced',
      });

      return {
        success: true,
        data: campaign,
      };

    } catch (error) {
      return {
        success: false,
        error: this.handleMetaError(error),
      };
    }
  }

  /**
   * Helper methods
   */
  
  mapMetaObjective(metaObjective) {
    const objectiveMap = {
      'AWARENESS': 'OUTCOME_AWARENESS',
      'TRAFFIC': 'OUTCOME_TRAFFIC',
      'ENGAGEMENT': 'OUTCOME_ENGAGEMENT',
      'LEADS': 'OUTCOME_LEADS',
      'APP_PROMOTION': 'OUTCOME_APP_PROMOTION',
      'SALES': 'OUTCOME_SALES',
      // Legacy objectives
      'LINK_CLICKS': 'OUTCOME_TRAFFIC',
      'POST_ENGAGEMENT': 'OUTCOME_ENGAGEMENT',
      'PAGE_LIKES': 'OUTCOME_ENGAGEMENT',
      'CONVERSIONS': 'OUTCOME_SALES',
    };
    
    return objectiveMap[metaObjective] || 'OUTCOME_TRAFFIC';
  }

  mapToMetaObjective(objective) {
    const objectiveMap = {
      'OUTCOME_AWARENESS': 'AWARENESS',
      'OUTCOME_TRAFFIC': 'TRAFFIC',
      'OUTCOME_ENGAGEMENT': 'ENGAGEMENT',
      'OUTCOME_LEADS': 'LEADS',
      'OUTCOME_APP_PROMOTION': 'APP_PROMOTION',
      'OUTCOME_SALES': 'SALES',
    };
    
    return objectiveMap[objective] || 'TRAFFIC';
  }

  extractConversions(actions) {
    if (!actions || !Array.isArray(actions)) return 0;
    
    const conversionActions = actions.filter(action => 
      action.action_type === 'purchase' || 
      action.action_type === 'complete_registration' ||
      action.action_type === 'submit_application'
    );
    
    return conversionActions.reduce((sum, action) => sum + parseInt(action.value), 0);
  }

  extractCostPerConversion(costPerActionType) {
    if (!costPerActionType || !Array.isArray(costPerActionType)) return 0;
    
    const conversionCosts = costPerActionType.filter(cost => 
      cost.action_type === 'purchase' || 
      cost.action_type === 'complete_registration'
    );
    
    return conversionCosts.length > 0 ? parseFloat(conversionCosts[0].value) : 0;
  }

  calculateConversionRate(insights) {
    const clicks = parseInt(insights.clicks) || 0;
    const conversions = this.extractConversions(insights.actions);
    
    return clicks > 0 ? (conversions / clicks) * 100 : 0;
  }

  handleMetaError(error) {
    if (error.response) {
      const { data } = error.response;
      return {
        message: data.error?.message || 'Meta API Error',
        code: data.error?.code || error.response.status,
        type: data.error?.type || 'api_error',
        subcode: data.error?.error_subcode,
      };
    }
    
    return {
      message: error.message || 'Unknown error',
      code: 'unknown',
      type: 'network_error',
    };
  }
}

module.exports = new MetaAdsService();