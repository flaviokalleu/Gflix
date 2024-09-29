// migrations/XXXXXX-add-tmdb-id-to-casts.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Casts', 'tmdb_id', {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Casts', 'tmdb_id');
  }
};
