'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ProductionCompanies', 'logo_path', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('ProductionCompanies', 'origin_country', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ProductionCompanies', 'logo_path');
    await queryInterface.removeColumn('ProductionCompanies', 'origin_country');
  },
};
