const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  address: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  businessType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true
  },
  taxId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  plan: {
    type: DataTypes.ENUM('free', 'starter', 'professional', 'enterprise'),
    defaultValue: 'free'
  },
  planExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  settings: {
    type: DataTypes.JSONB,
    defaultValue: {
      timezone: 'America/Sao_Paulo',
      currency: 'BRL',
      language: 'pt-BR',
      dateFormat: 'DD/MM/YYYY'
    }
  },
  limits: {
    type: DataTypes.JSONB,
    defaultValue: {
      users: 5,
      campaigns: 10,
      landingPages: 20,
      monthlyLeads: 1000,
      storage: 5368709120
    }
  },
  integrations: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  timestamps: true
});

module.exports = Company;