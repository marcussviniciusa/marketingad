const express = require('express');
const router = express.Router();
const { authenticate, authorizeCompany, checkPermission } = require('../middlewares/auth');
const metaAdsService = require('../services/metaAdsService');
const { MetaAccount, Campaign, AdSet, Ad } = require('../models');
const { Op, fn, col, literal } = require('sequelize');
const { sequelize } = require('../config/database');

// Middleware para todas as rotas
router.use(authenticate);
router.use(authorizeCompany);

/**
 * GET /api/meta-ads/accounts
 * Get all Meta Ad accounts for company
 */
router.get('/accounts', async (req, res) => {
  try {
    const accounts = await MetaAccount.findAll({
      where: { companyId: req.companyId },
      attributes: [
        'id', 'metaAdAccountId', 'accountName', 'currency', 
        'status', 'lastSyncAt', 'syncStatus', 'errorMessage'
      ]
    });

    res.json({ success: true, data: accounts });
  } catch (error) {
    console.error('Error fetching Meta accounts:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch Meta accounts' 
    });
  }
});

/**
 * POST /api/meta-ads/accounts
 * Add new Meta Ad account
 */
router.post('/accounts', checkPermission('ads', 'management'), async (req, res) => {
  try {
    const { accessToken, adAccountId, accountName } = req.body;

    if (!accessToken || !adAccountId || !accountName) {
      return res.status(400).json({
        success: false,
        error: 'Access token, ad account ID, and account name are required'
      });
    }

    // Test connection to Meta API
    const testResult = await metaAdsService.testConnection(accessToken, adAccountId);
    
    if (!testResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to connect to Meta API: ' + testResult.error.message
      });
    }

    // Check if account already exists
    const existingAccount = await MetaAccount.findOne({
      where: { metaAdAccountId: adAccountId }
    });

    if (existingAccount) {
      return res.status(400).json({
        success: false,
        error: 'This Meta Ad account is already connected'
      });
    }

    // Create Meta account record
    const metaAccount = await MetaAccount.create({
      companyId: req.companyId,
      metaAdAccountId: adAccountId,
      accessToken: accessToken,
      accountName: accountName,
      currency: testResult.data.currency || 'BRL',
      timezone: testResult.data.timezone_name || 'America/Sao_Paulo',
      status: 'active',
      syncStatus: 'pending',
      accountInfo: testResult.data,
      permissions: {
        ads_read: true,
        ads_management: true,
        business_management: false,
      }
    });

    // Start initial sync
    setTimeout(() => {
      metaAdsService.syncCampaigns(metaAccount.id).catch(console.error);
    }, 1000);

    res.json({ 
      success: true, 
      data: {
        id: metaAccount.id,
        metaAdAccountId: metaAccount.metaAdAccountId,
        accountName: metaAccount.accountName,
        status: metaAccount.status,
        syncStatus: metaAccount.syncStatus
      }
    });

  } catch (error) {
    console.error('Error adding Meta account:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add Meta account' 
    });
  }
});

/**
 * POST /api/meta-ads/accounts/:id/sync
 * Sync campaigns from Meta API
 */
router.post('/accounts/:id/sync', checkPermission('ads', 'read'), async (req, res) => {
  try {
    const { id } = req.params;

    const metaAccount = await MetaAccount.findOne({
      where: { id, companyId: req.companyId }
    });

    if (!metaAccount) {
      return res.status(404).json({
        success: false,
        error: 'Meta account not found'
      });
    }

    // Update sync status to 'syncing'
    await metaAccount.update({ syncStatus: 'syncing' });

    // Sync campaigns
    const syncResult = await metaAdsService.syncCampaigns(id);

    res.json(syncResult);

  } catch (error) {
    console.error('Error syncing Meta account:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to sync Meta account' 
    });
  }
});

/**
 * GET /api/meta-ads/campaigns
 * Get all campaigns for company
 */
router.get('/campaigns', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, objective, search } = req.query;
    const offset = (page - 1) * limit;

    const where = { companyId: req.companyId };
    
    if (status) {
      where.status = status;
    }
    
    if (objective) {
      where.objective = objective;
    }
    
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    const { count, rows: campaigns } = await Campaign.findAndCountAll({
      where,
      include: [
        {
          model: MetaAccount,
          as: 'metaAccount',
          attributes: ['id', 'accountName', 'currency']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: campaigns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch campaigns' 
    });
  }
});

/**
 * GET /api/meta-ads/campaigns/:id
 * Get single campaign with details
 */
router.get('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findOne({
      where: { id, companyId: req.companyId },
      include: [
        {
          model: MetaAccount,
          as: 'metaAccount',
          attributes: ['id', 'accountName', 'currency']
        },
        {
          model: AdSet,
          as: 'adSets',
          include: [
            {
              model: Ad,
              as: 'ads',
              attributes: ['id', 'name', 'status', 'impressions', 'clicks', 'spend']
            }
          ]
        }
      ]
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }

    res.json({ success: true, data: campaign });

  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch campaign' 
    });
  }
});

/**
 * POST /api/meta-ads/campaigns
 * Create new campaign
 */
router.post('/campaigns', checkPermission('ads', 'management'), async (req, res) => {
  try {
    const { metaAccountId, name, objective, status, spendCap, startTime, stopTime, specialAdCategories } = req.body;

    if (!metaAccountId || !name || !objective) {
      return res.status(400).json({
        success: false,
        error: 'Meta account ID, name, and objective are required'
      });
    }

    // Verify meta account belongs to company
    const metaAccount = await MetaAccount.findOne({
      where: { id: metaAccountId, companyId: req.companyId }
    });

    if (!metaAccount) {
      return res.status(404).json({
        success: false,
        error: 'Meta account not found'
      });
    }

    const campaignData = {
      name,
      objective,
      status: status || 'PAUSED',
      spendCap,
      startTime,
      stopTime,
      specialAdCategories: specialAdCategories || []
    };

    // Create campaign via Meta API
    const result = await metaAdsService.createCampaign(metaAccountId, campaignData);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);

  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create campaign' 
    });
  }
});

/**
 * PUT /api/meta-ads/campaigns/:id
 * Update campaign
 */
router.put('/campaigns/:id', checkPermission('ads', 'management'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, spendCap, startTime, stopTime } = req.body;

    // Verify campaign belongs to company
    const campaign = await Campaign.findOne({
      where: { id, companyId: req.companyId }
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (status !== undefined) updateData.status = status;
    if (spendCap !== undefined) updateData.spendCap = spendCap;
    if (startTime !== undefined) updateData.startTime = startTime;
    if (stopTime !== undefined) updateData.stopTime = stopTime;

    // Update via Meta API and local database
    const result = await metaAdsService.updateCampaign(id, updateData);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);

  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update campaign' 
    });
  }
});

/**
 * GET /api/meta-ads/campaigns/:id/insights
 * Get campaign performance insights
 */
router.get('/campaigns/:id/insights', async (req, res) => {
  try {
    const { id } = req.params;
    const { dateRange = 'last_30_days' } = req.query;

    const campaign = await Campaign.findOne({
      where: { id, companyId: req.companyId },
      include: ['metaAccount']
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }

    // Get insights from Meta API
    const result = await metaAdsService.getCampaignInsights(campaign.metaAccountId, id, dateRange);

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Also return current campaign metrics
    const metrics = {
      impressions: campaign.impressions,
      clicks: campaign.clicks,
      spend: parseFloat(campaign.spend),
      cpm: parseFloat(campaign.cpm),
      cpc: parseFloat(campaign.cpc),
      ctr: parseFloat(campaign.ctr),
      conversions: campaign.conversions,
      conversionRate: parseFloat(campaign.conversionRate),
      costPerConversion: parseFloat(campaign.costPerConversion),
      reach: campaign.reach,
      frequency: parseFloat(campaign.frequency),
      roas: campaign.getRoas(),
    };

    res.json({ 
      success: true, 
      data: metrics,
      lastSyncAt: campaign.lastSyncAt
    });

  } catch (error) {
    console.error('Error fetching campaign insights:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch campaign insights' 
    });
  }
});

/**
 * GET /api/meta-ads/dashboard
 * Get dashboard summary data
 */
router.get('/dashboard', async (req, res) => {
  try {
    const { dateRange = '30' } = req.query; // days
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));

    // Get campaign summary
    const campaignStats = await Campaign.findAll({
      where: { 
        companyId: req.companyId,
        createdAt: { [Op.gte]: daysAgo }
      },
      attributes: [
        [fn('COUNT', col('id')), 'totalCampaigns'],
        [fn('COUNT', literal("CASE WHEN status = 'ACTIVE' THEN 1 END")), 'activeCampaigns'],
        [fn('SUM', col('spend')), 'totalSpend'],
        [fn('SUM', col('impressions')), 'totalImpressions'],
        [fn('SUM', col('clicks')), 'totalClicks'],
        [fn('SUM', col('conversions')), 'totalConversions'],
      ],
      raw: true
    });

    // Get top performing campaigns
    const topCampaigns = await Campaign.findAll({
      where: { 
        companyId: req.companyId,
        status: 'ACTIVE',
        impressions: { [Op.gt]: 0 }
      },
      order: [['spend', 'DESC']],
      limit: 5,
      attributes: ['id', 'name', 'spend', 'impressions', 'clicks', 'conversions', 'ctr']
    });

    // Get recent campaigns
    const recentCampaigns = await Campaign.findAll({
      where: { companyId: req.companyId },
      order: [['createdAt', 'DESC']],
      limit: 10,
      attributes: ['id', 'name', 'status', 'objective', 'spend', 'impressions', 'clicks', 'createdAt']
    });

    const stats = campaignStats[0] || {};
    
    res.json({
      success: true,
      data: {
        summary: {
          totalCampaigns: parseInt(stats.totalCampaigns) || 0,
          activeCampaigns: parseInt(stats.activeCampaigns) || 0,
          totalSpend: parseFloat(stats.totalSpend) || 0,
          totalImpressions: parseInt(stats.totalImpressions) || 0,
          totalClicks: parseInt(stats.totalClicks) || 0,
          totalConversions: parseInt(stats.totalConversions) || 0,
          averageCtr: stats.totalImpressions > 0 ? ((stats.totalClicks / stats.totalImpressions) * 100).toFixed(2) : 0,
          averageCpc: stats.totalClicks > 0 ? (stats.totalSpend / stats.totalClicks).toFixed(2) : 0,
        },
        topCampaigns,
        recentCampaigns,
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch dashboard data' 
    });
  }
});

module.exports = router;