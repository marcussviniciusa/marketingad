const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AdCreative = sequelize.define('AdCreative', {
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
  metaCreativeId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    comment: 'Meta Ad Creative ID from Facebook/Instagram API',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Creative name for internal reference',
  },
  // Creative Type and Format
  creativeType: {
    type: DataTypes.ENUM(
      'SINGLE_IMAGE',
      'SINGLE_VIDEO', 
      'CAROUSEL',
      'COLLECTION',
      'SLIDESHOW',
      'INSTANT_EXPERIENCE'
    ),
    allowNull: false,
    defaultValue: 'SINGLE_IMAGE',
  },
  // Text Content
  title: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Ad title/headline',
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Primary text/description',
  },
  callToActionType: {
    type: DataTypes.ENUM(
      'LEARN_MORE', 'SHOP_NOW', 'BOOK_TRAVEL', 'DOWNLOAD',
      'WATCH_MORE', 'SIGN_UP', 'APPLY_NOW', 'GET_QUOTE',
      'CONTACT_US', 'SUBSCRIBE', 'INSTALL_APP', 'USE_APP',
      'PLAY_GAME', 'WATCH_VIDEO', 'START_ORDER', 'GET_DIRECTIONS'
    ),
    allowNull: true,
    comment: 'Call-to-action button type',
  },
  // URLs and Links
  websiteUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Destination URL when ad is clicked',
  },
  displayLink: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Display URL shown in the ad',
  },
  // Media Information
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Primary image URL',
  },
  imageHash: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Meta image hash for uploaded images',
  },
  videoId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Meta video ID for uploaded videos',
  },
  videoUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Video URL (for reference)',
  },
  thumbnailUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Video thumbnail URL',
  },
  // Carousel/Collection specific
  childAttachments: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Array of child attachments for carousel/collection ads',
  },
  // Page Information (for some ad types)
  pageId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Facebook Page ID associated with the creative',
  },
  instagramActorId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Instagram account ID for Instagram ads',
  },
  // Branding
  brandingText: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Branding text (e.g., "Sponsored" label text)',
  },
  // Creative specifications from Meta API
  objectStorySpec: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Complete object story specification for Meta API',
  },
  // Creative Testing
  isTemplate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether this creative is saved as a template',
  },
  templateCategory: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Category for template organization',
  },
  // Performance Tracking
  impressions: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
    comment: 'Total impressions across all ads using this creative',
  },
  clicks: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
    comment: 'Total clicks across all ads using this creative',
  },
  spend: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Total spend across all ads using this creative',
  },
  conversions: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
    comment: 'Total conversions across all ads using this creative',
  },
  ctr: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
    defaultValue: 0,
    comment: 'Average CTR across all ads using this creative',
  },
  // Status and Review
  status: {
    type: DataTypes.ENUM('ACTIVE', 'DELETED', 'ARCHIVED'),
    allowNull: false,
    defaultValue: 'ACTIVE',
  },
  reviewStatus: {
    type: DataTypes.ENUM('APPROVED', 'PENDING_REVIEW', 'REJECTED', 'NO_REVIEW'),
    allowNull: false,
    defaultValue: 'NO_REVIEW',
  },
  reviewFeedback: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Review feedback from Meta if creative is rejected',
  },
  // Asset Information
  imageWidth: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Image width in pixels',
  },
  imageHeight: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Image height in pixels',
  },
  videoDuration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Video duration in seconds',
  },
  fileSize: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'File size in bytes',
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
    comment: 'Additional creative data from Meta API',
  },
  // Preview URLs
  previewUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'URL to preview the creative',
  },
}, {
  tableName: 'ad_creatives',
  indexes: [
    {
      fields: ['companyId'],
    },
    {
      fields: ['metaCreativeId'],
      unique: true,
      where: {
        metaCreativeId: { [sequelize.Sequelize.Op.ne]: null }
      }
    },
    {
      fields: ['creativeType'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['reviewStatus'],
    },
    {
      fields: ['isTemplate'],
    },
    {
      fields: ['templateCategory'],
    },
    {
      fields: ['syncStatus'],
    },
  ],
});

// Virtual methods for creative analysis
AdCreative.prototype.getPerformanceScore = function() {
  if (this.impressions === 0) return 0;
  
  // Simple performance score based on CTR and conversion rate
  const conversionRate = this.impressions > 0 ? (this.conversions / this.impressions) * 100 : 0;
  const ctrWeight = 0.6;
  const conversionWeight = 0.4;
  
  return (this.ctr * ctrWeight) + (conversionRate * conversionWeight);
};

AdCreative.prototype.getAspectRatio = function() {
  if (!this.imageWidth || !this.imageHeight) return null;
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(this.imageWidth, this.imageHeight);
  return `${this.imageWidth / divisor}:${this.imageHeight / divisor}`;
};

AdCreative.prototype.isVideoContent = function() {
  return this.creativeType === 'SINGLE_VIDEO' && (this.videoId || this.videoUrl);
};

module.exports = AdCreative;