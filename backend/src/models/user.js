module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  User.associate = function(models) {
    User.belongsToMany(models.Role, {
      through: 'UserRole', // Tabela de junção
      foreignKey: 'user_id',
      as: 'Roles' // Alias definido para as roles
    });
  };

  return User;
};
