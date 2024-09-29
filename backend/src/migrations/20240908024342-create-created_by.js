'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CreatedBys', {
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
      name: Sequelize.STRING,
      gender: Sequelize.INTEGER,
      profile_path: Sequelize.STRING,
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
    await queryInterface.dropTable('CreatedBys');
  }
};
