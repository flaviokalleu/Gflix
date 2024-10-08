'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SeriesProductionCompanies', {
      series_tmdb_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      production_company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SeriesProductionCompanies');
  }
};
