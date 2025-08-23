const User = require('./User');
const Company = require('./Company');
const UserCompany = require('./UserCompany');

// User <-> Company (Many-to-Many through UserCompany)
User.belongsToMany(Company, {
  through: UserCompany,
  foreignKey: 'userId',
  otherKey: 'companyId',
  as: 'companies'
});

Company.belongsToMany(User, {
  through: UserCompany,
  foreignKey: 'companyId',
  otherKey: 'userId',
  as: 'users'
});

// Direct associations for UserCompany
UserCompany.belongsTo(User, { foreignKey: 'userId' });
UserCompany.belongsTo(Company, { foreignKey: 'companyId' });

User.hasMany(UserCompany, { foreignKey: 'userId', as: 'userCompanies' });
Company.hasMany(UserCompany, { foreignKey: 'companyId', as: 'companyUsers' });

module.exports = {
  User,
  Company,
  UserCompany
};