// migrations/xxxx-update-player-links.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Movies', 'player_links', {
      type: Sequelize.STRING(255),
      allowNull: true // Ajuste conforme necessário
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Movies', 'player_links', {
      type: Sequelize.STRING, // ou o tipo original, se diferente
      allowNull: true // Ajuste conforme necessário
    });
  }
};
