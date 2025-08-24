const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AdSet = sequelize.define('AdSet', {
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
  campaignId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'campaigns',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  metaAdSetId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    comment: 'Meta AdSet ID from Facebook/Instagram API',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Ad set name',
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED'),
    allowNull: false,
    defaultValue: 'PAUSED',
  },
  // Budget Configuration
  budgetType: {
    type: DataTypes.ENUM('DAILY', 'LIFETIME'),
    allowNull: false,
    defaultValue: 'DAILY',
  },
  dailyBudget: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: 'Daily budget in account currency',
  },
  lifetimeBudget: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: 'Lifetime budget in account currency',
  },
  // Bidding Configuration
  bidStrategy: {
    type: DataTypes.ENUM('LOWEST_COST_WITHOUT_CAP', 'LOWEST_COST_WITH_BID_CAP', 'TARGET_COST'),
    allowNull: false,
    defaultValue: 'LOWEST_COST_WITHOUT_CAP',
  },
  bidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Bid amount when using bid cap or target cost',
  },
  // Optimization and Delivery
  optimizationGoal: {
    type: DataTypes.ENUM(
      'REACH', 'LINK_CLICKS', 'IMPRESSIONS', 'PAGE_LIKES',
      'POST_ENGAGEMENT', 'CONVERSIONS', 'APP_INSTALLS',
      'VIDEO_VIEWS', 'LEAD_GENERATION', 'LANDING_PAGE_VIEWS'
    ),
    allowNull: false,
    defaultValue: 'LINK_CLICKS',
  },
  billingEvent: {
    type: DataTypes.ENUM('IMPRESSIONS', 'CLICKS', 'ACTIONS'),
    allowNull: false,
    defaultValue: 'IMPRESSIONS',
  },
  // Scheduling
  startTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Ad set start time',
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Ad set end time',
  },
  // Targeting Configuration
  targeting: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      geoLocations: {
        countries: ['BR']
      },
      ageMin: 18,
      ageMax: 65,
      genders: [1, 2] // 1: male, 2: female
    },
    comment: 'Complete targeting specification as JSON',
  },
  // Placement Configuration
  publisherPlatforms: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: ['facebook', 'instagram'],
    comment: 'Platforms where ads will be shown',
  },
  facebookPositions: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: ['feed'],
    comment: 'Facebook ad positions',
  },
  instagramPositions: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: ['stream', 'story'],
    comment: 'Instagram ad positions',
  },
  devicePlatforms: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: ['mobile', 'desktop'],
    comment: 'Device platforms to target',
  },
  // Attribution Configuration
  attributionSpec: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      eventType: 'CLICK_THROUGH',
      windowDays: 7
    },
    comment: 'Attribution specification for conversion tracking',
  },
  // Performance Metrics
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
  },
  cpm: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  cpc: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  ctr: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
    defaultValue: 0,
  },
  conversions: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
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
  },
  frequency: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  // Sync information
  lastSyncAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  syncStatus: {
    type: DataTypes.ENUM('synced', 'syncing', 'error', 'pending'),
    allowNull: false,
    defaultValue: 'pending',
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metaData: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Additional ad set data from Meta API',
  },
}, {
  tableName: 'ad_sets',
  indexes: [
    {
      fields: ['companyId'],
    },
    {
      fields: ['campaignId'],
    },
    {
      fields: ['metaAdSetId'],
      unique: true,
      where: {
        metaAdSetId: { [sequelize.Sequelize.Op.ne]: null }
      }
    },
    {
      fields: ['status'],
    },
    {
      fields: ['optimizationGoal'],
    },
    {
      fields: ['syncStatus'],
    },
  ],
});

// Virtual methods for budget management
AdSet.prototype.getBudgetRemaining = function() {
  if (this.budgetType === 'DAILY') {
    return Math.max(0, (this.dailyBudget || 0) - this.spend);
  } else {
    return Math.max(0, (this.lifetimeBudget || 0) - this.spend);
  }
};

AdSet.prototype.getBudgetUtilization = function() {
  const budget = this.budgetType === 'DAILY' ? this.dailyBudget : this.lifetimeBudget;
  if (!budget || budget === 0) return 0;
  return Math.min(100, (this.spend / budget) * 100);
};

module.exports = AdSet;