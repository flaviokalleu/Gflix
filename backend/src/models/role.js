module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  Role.associate = function(models) {
    Role.belongsToMany(models.User, {
      through: 'UserRole', // Tabela de junção
      foreignKey: 'role_id',
      as: 'Users' // Alias definido para os usuários
    });
  };

  return Role;
};
