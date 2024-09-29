'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Casts', 'profile_path', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Directors', 'profile_path', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Networks', 'logo_path', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Casts', 'profile_path');
    await queryInterface.removeColumn('Directors', 'profile_path');
    await queryInterface.removeColumn('Networks', 'logo_path');
  }
};
