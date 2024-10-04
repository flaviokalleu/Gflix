// models/Token.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Corrigido para DataTypes.NOW
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'tokens',
    timestamps: false,
  });

  Token.associate = (models) => {
    Token.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
  };

  return Token;
};
