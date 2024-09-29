'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Series', {
      tmdb_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      overview: Sequelize.TEXT,
      backdrop_path: Sequelize.STRING,
      first_air_date: Sequelize.STRING,
      last_air_date: Sequelize.STRING,
      number_of_episodes: Sequelize.INTEGER,
      number_of_seasons: Sequelize.INTEGER,
      original_language: Sequelize.STRING,
      status: Sequelize.STRING,
      popularity: Sequelize.FLOAT,
      vote_average: Sequelize.FLOAT,
      vote_count: Sequelize.INTEGER,
      homepage: Sequelize.STRING,
      poster_path: Sequelize.STRING,
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
    await queryInterface.dropTable('Series');
  }
};
