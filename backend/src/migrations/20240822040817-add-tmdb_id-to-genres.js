'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Genres', 'tmdb_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // ou false, se for obrigatório
      unique: true, // se quiser garantir que o valor de tmdb_id seja único
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Genres', 'tmdb_id');
  }
};
