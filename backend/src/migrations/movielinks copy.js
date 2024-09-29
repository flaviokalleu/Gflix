'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Movies', 'player_links', {
      type: Sequelize.JSON,
      allowNull: true, // Pode ser alterado para false se quiser que o campo seja obrigatório
      defaultValue: [] // Padrão como array vazio para armazenar múltiplos links de players
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Movies', 'player_links');
  }
};
