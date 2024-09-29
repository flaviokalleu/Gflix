'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Networks', 'tmdb_network_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true // Se necessário, pode ser removido se não for obrigatório ser único
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Networks', 'tmdb_network_id');
  }
};
