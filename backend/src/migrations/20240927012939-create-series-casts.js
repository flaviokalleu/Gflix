'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('seriescasts', {
      series_tmdb_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Series', // Nome da tabela de séries
          key: 'tmdb_id',
        },
        onDelete: 'CASCADE',
      },
      cast_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Casts', // Nome da tabela de elenco
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('seriescasts');
  },
};
