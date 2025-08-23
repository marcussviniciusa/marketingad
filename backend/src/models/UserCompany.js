const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserCompany = sequelize.define('UserCompany', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'id'
    }
  },
  role: {
    type: DataTypes.ENUM('owner', 'admin', 'manager', 'member', 'viewer'),
    defaultValue: 'member'
  },
  permissions: {
    type: DataTypes.JSONB,
    defaultValue: {
      campaigns: {
        create: false,
        read: true,
        update: false,
        delete: false
      },
      landingPages: {
        create: false,
        read: true,
        update: false,
        delete: false
      },
      leads: {
        create: true,
        read: true,
        update: true,
        delete: false
      },
      analytics: {
        read: true
      },
      settings: {
        manage: false
      },
      users: {
        manage: false
      },
      billing: {
        manage: false
      }
    }
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  joinedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  invitedBy: {
    type: DataTypes.UUID,
    allowNull: true
  },
  lastAccessAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'companyId']
    }
  ]
});

module.exports = UserCompany;