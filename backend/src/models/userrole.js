'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate(models) {
      // Definindo associações se necessário
      UserRole.belongsTo(models.User, { foreignKey: 'user_id' });
      UserRole.belongsTo(models.Role, { foreignKey: 'role_id' });
    }
  }
  UserRole.init({
    user_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserRole',
  });
  return UserRole;
};
