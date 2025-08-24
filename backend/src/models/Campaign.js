const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  metaAccountId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'meta_accounts',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  metaCampaignId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    comment: 'Meta Campaign ID from Facebook/Instagram API',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Campaign name',
  },
  objective: {
    type: DataTypes.ENUM(
      'OUTCOME_AWARENESS',
      'OUTCOME_TRAFFIC', 
      'OUTCOME_ENGAGEMENT',
      'OUTCOME_LEADS',
      'OUTCOME_APP_PROMOTION',
      'OUTCOME_SALES'
    ),
    allowNull: false,
    comment: 'Campaign objective based on Meta Marketing API v19+',
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED'),
    allowNull: false,
    defaultValue: 'PAUSED',
    comment: 'Campaign status',
  },
  specialAdCategories: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
    comment: 'Special ad categories (e.g., CREDIT, EMPLOYMENT, HOUSING)',
  },
  spendCap: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: 'Campaign spending cap in account currency',
  },
  budgetRebalanceFlag: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether to rebalance budget between ad sets',
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Campaign start time',
  },
  stopTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Campaign end time',
  },
  // Performance Metrics (synced from Meta API)
  impressions: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  clicks: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  spend: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Total amount spent in account currency',
  },
  cpm: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Cost per 1000 impressions',
  },
  cpc: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Cost per click',
  },
  ctr: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
    defaultValue: 0,
    comment: 'Click-through rate (percentage as decimal)',
  },
  conversions: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  conversionRate: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
    defaultValue: 0,
    comment: 'Conversion rate (percentage as decimal)',
  },
  costPerConversion: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  reach: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of unique people reached',
  },
  frequency: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Average times each person saw the ads',
  },
  // Sync information
  lastSyncAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Last sync with Meta API',
  },
  syncStatus: {
    type: DataTypes.ENUM('synced', 'syncing', 'error', 'pending'),
    allowNull: false,
    defaultValue: 'pending',
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Last error message from sync',
  },
  // Additional data from Meta API
  metaData: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Additional campaign data from Meta API',
  },
}, {
  tableName: 'campaigns',
  indexes: [
    {
      fields: ['companyId'],
    },
    {
      fields: ['metaAccountId'],
    },
    {
      fields: ['metaCampaignId'],
      unique: true,
      where: {
        metaCampaignId: { [sequelize.Sequelize.Op.ne]: null }
      }
    },
    {
      fields: ['status'],
    },
    {
      fields: ['objective'],
    },
    {
      fields: ['syncStatus'],
    },
    {
      fields: ['createdAt'],
    },
  ],
});

// Virtual fields for calculated metrics
Campaign.prototype.getRoas = function() {
  if (this.spend === 0) return 0;
  return (this.conversions * 100) / this.spend; // Assuming average conversion value of 100
};

Campaign.prototype.getCostPer1000Impressions = function() {
  if (this.impressions === 0) return 0;
  return (this.spend / this.impressions) * 1000;
};

module.exports = Campaign;