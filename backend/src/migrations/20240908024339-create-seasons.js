'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Seasons', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      series_tmdb_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Series', key: 'tmdb_id' },
        onDelete: 'CASCADE'
      },
      air_date: Sequelize.STRING,
      episode_count: Sequelize.INTEGER,
      name: Sequelize.STRING,
      overview: Sequelize.TEXT,
      poster_path: Sequelize.STRING,
      season_number: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Seasons');
  }
};
