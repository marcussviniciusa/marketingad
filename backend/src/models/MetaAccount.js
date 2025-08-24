const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MetaAccount = sequelize.define('MetaAccount', {
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
  metaAdAccountId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Meta Ad Account ID (act_xxxxxxxxx)',
  },
  accessToken: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Meta Access Token for API access',
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Meta Refresh Token',
  },
  tokenExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Token expiration date',
  },
  accountName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Friendly name for the Meta account',
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'BRL',
    comment: 'Account currency (ISO 4217)',
  },
  timezone: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'America/Sao_Paulo',
    comment: 'Account timezone',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'error'),
    allowNull: false,
    defaultValue: 'active',
  },
  lastSyncAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Last successful sync with Meta API',
  },
  syncStatus: {
    type: DataTypes.ENUM('synced', 'syncing', 'error', 'pending'),
    allowNull: false,
    defaultValue: 'pending',
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Last error message from Meta API',
  },
  accountInfo: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Additional Meta account information',
  },
  permissions: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      ads_read: false,
      ads_management: false,
      business_management: false,
    },
    comment: 'Meta API permissions granted',
  },
}, {
  tableName: 'meta_accounts',
  indexes: [
    {
      fields: ['companyId'],
    },
    {
      fields: ['metaAdAccountId'],
      unique: true,
    },
    {
      fields: ['status'],
    },
    {
      fields: ['syncStatus'],
    },
  ],
});

module.exports = MetaAccount;