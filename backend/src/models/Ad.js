const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Ad = sequelize.define('Ad', {
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
  adSetId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'ad_sets',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  adCreativeId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'ad_creatives',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  metaAdId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    comment: 'Meta Ad ID from Facebook/Instagram API',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Ad name',
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED', 'PENDING_REVIEW', 'DISAPPROVED'),
    allowNull: false,
    defaultValue: 'PAUSED',
  },
  // Review Information
  adReviewFeedback: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Review feedback from Meta if ad is rejected',
  },
  configuredStatus: {
    type: DataTypes.ENUM('ACTIVE', 'PAUSED', 'ARCHIVED'),
    allowNull: false,
    defaultValue: 'PAUSED',
    comment: 'Status configured by advertiser',
  },
  effectiveStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Current effective status from Meta API',
  },
  // Tracking and URLs
  trackingSpecs: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Conversion tracking specifications',
  },
  urlTags: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL parameters for tracking (UTM parameters)',
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
    comment: 'Click-through rate',
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
    comment: 'Average times each person saw the ad',
  },
  // Engagement Metrics
  postLikes: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  postComments: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  postShares: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  videoViews: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  videoPlays25Percent: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  videoPlays50Percent: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  videoPlays75Percent: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  videoPlaysComplete: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  // Instagram specific metrics
  instagramReach: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  instagramImpressions: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  // Facebook specific metrics
  facebookReach: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  facebookImpressions: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  // A/B Testing
  isTestAd: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  testGroup: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'A/B test group identifier',
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
    comment: 'Additional ad data from Meta API',
  },
  // Preview information
  previewUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'URL to preview the ad',
  },
}, {
  tableName: 'ads',
  indexes: [
    {
      fields: ['companyId'],
    },
    {
      fields: ['campaignId'],
    },
    {
      fields: ['adSetId'],
    },
    {
      fields: ['adCreativeId'],
    },
    {
      fields: ['metaAdId'],
      unique: true,
      where: {
        metaAdId: { [sequelize.Sequelize.Op.ne]: null }
      }
    },
    {
      fields: ['status'],
    },
    {
      fields: ['effectiveStatus'],
    },
    {
      fields: ['syncStatus'],
    },
    {
      fields: ['isTestAd', 'testGroup'],
    },
  ],
});

// Virtual methods for performance analysis
Ad.prototype.getEngagementRate = function() {
  if (this.impressions === 0) return 0;
  const totalEngagements = this.postLikes + this.postComments + this.postShares;
  return (totalEngagements / this.impressions) * 100;
};

Ad.prototype.getVideoCompletionRate = function() {
  if (this.videoViews === 0) return 0;
  return (this.videoPlaysComplete / this.videoViews) * 100;
};

Ad.prototype.getRoas = function(conversionValue = 100) {
  if (this.spend === 0) return 0;
  const revenue = this.conversions * conversionValue;
  return revenue / this.spend;
};

module.exports = Ad;