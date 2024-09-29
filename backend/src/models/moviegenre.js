// src/models/moviegenre.js
const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const MovieGenre = sequelize.define('MovieGenre', {
    movie_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Movies',
        key: 'id'
      }
    },
    genre_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Genres',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW // Usa DataTypes.NOW para o valor padrão
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW // Usa DataTypes.NOW para o valor padrão
    }
  }, {
    timestamps: true // Garante que o Sequelize gerencie createdAt e updatedAt
  });

  return MovieGenre;
};
