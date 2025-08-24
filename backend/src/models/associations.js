const User = require('./User');
const Company = require('./Company');
const UserCompany = require('./UserCompany');
const MetaAccount = require('./MetaAccount');
const Campaign = require('./Campaign');
const AdSet = require('./AdSet');
const Ad = require('./Ad');
const AdCreative = require('./AdCreative');

// User and Company associations (existing)
User.belongsToMany(Company, {
  through: UserCompany,
  foreignKey: 'userId',
  otherKey: 'companyId',
  as: 'companies',
});

Company.belongsToMany(User, {
  through: UserCompany,
  foreignKey: 'companyId',
  otherKey: 'userId',
  as: 'users',
});

User.hasMany(UserCompany, { foreignKey: 'userId' });
UserCompany.belongsTo(User, { foreignKey: 'userId' });

Company.hasMany(UserCompany, { foreignKey: 'companyId' });
UserCompany.belongsTo(Company, { foreignKey: 'companyId' });

// Meta Ads associations

// Company -> MetaAccount (1:N)
Company.hasMany(MetaAccount, {
  foreignKey: 'companyId',
  as: 'metaAccounts',
  onDelete: 'CASCADE',
});

MetaAccount.belongsTo(Company, {
  foreignKey: 'companyId',
  as: 'company',
});

// MetaAccount -> Campaign (1:N)
MetaAccount.hasMany(Campaign, {
  foreignKey: 'metaAccountId',
  as: 'campaigns',
  onDelete: 'CASCADE',
});

Campaign.belongsTo(MetaAccount, {
  foreignKey: 'metaAccountId',
  as: 'metaAccount',
});

// Company -> Campaign (1:N) - Direct relationship for easier queries
Company.hasMany(Campaign, {
  foreignKey: 'companyId',
  as: 'campaigns',
  onDelete: 'CASCADE',
});

Campaign.belongsTo(Company, {
  foreignKey: 'companyId',
  as: 'company',
});

// Campaign -> AdSet (1:N)
Campaign.hasMany(AdSet, {
  foreignKey: 'campaignId',
  as: 'adSets',
  onDelete: 'CASCADE',
});

AdSet.belongsTo(Campaign, {
  foreignKey: 'campaignId',
  as: 'campaign',
});

// Company -> AdSet (1:N) - Direct relationship
Company.hasMany(AdSet, {
  foreignKey: 'companyId',
  as: 'adSets',
  onDelete: 'CASCADE',
});

AdSet.belongsTo(Company, {
  foreignKey: 'companyId',
  as: 'company',
});

// AdSet -> Ad (1:N)
AdSet.hasMany(Ad, {
  foreignKey: 'adSetId',
  as: 'ads',
  onDelete: 'CASCADE',
});

Ad.belongsTo(AdSet, {
  foreignKey: 'adSetId',
  as: 'adSet',
});

// Campaign -> Ad (1:N) - Direct relationship for easier queries
Campaign.hasMany(Ad, {
  foreignKey: 'campaignId',
  as: 'ads',
  onDelete: 'CASCADE',
});

Ad.belongsTo(Campaign, {
  foreignKey: 'campaignId',
  as: 'campaign',
});

// Company -> Ad (1:N) - Direct relationship
Company.hasMany(Ad, {
  foreignKey: 'companyId',
  as: 'ads',
  onDelete: 'CASCADE',
});

Ad.belongsTo(Company, {
  foreignKey: 'companyId',
  as: 'company',
});

// AdCreative associations
Company.hasMany(AdCreative, {
  foreignKey: 'companyId',
  as: 'adCreatives',
  onDelete: 'CASCADE',
});

AdCreative.belongsTo(Company, {
  foreignKey: 'companyId',
  as: 'company',
});

// AdCreative -> Ad (1:N)
AdCreative.hasMany(Ad, {
  foreignKey: 'adCreativeId',
  as: 'ads',
  onDelete: 'SET NULL', // Don't delete ads when creative is deleted
});

Ad.belongsTo(AdCreative, {
  foreignKey: 'adCreativeId',
  as: 'adCreative',
});

module.exports = {
  User,
  Company,
  UserCompany,
  MetaAccount,
  Campaign,
  AdSet,
  Ad,
  AdCreative,
};