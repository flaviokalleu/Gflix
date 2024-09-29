// migrations/xxxx-create-movie-casts.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MovieCasts', {
      movie_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Movies', // Nome da tabela de filmes
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cast_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Casts', // Nome da tabela de elenco
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MovieCasts');
  }
};
