'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Episodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      overview: {
        type: Sequelize.TEXT
      },
      vote_average: {
        type: Sequelize.FLOAT
      },
      vote_count: {
        type: Sequelize.INTEGER
      },
      air_date: {
        type: Sequelize.DATE // Usando DATE em vez de STRING
      },
      episode_number: {
        type: Sequelize.INTEGER
      },
      still_path: {
        type: Sequelize.STRING
      },
      season_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Seasons', // Certifique-se de que o nome da tabela esteja correto
          key: 'id',
        },
      },
      link: {
        type: Sequelize.STRING
      },
      runtime: {
        type: Sequelize.INTEGER
      },
      production_code: {
        type: Sequelize.STRING
      },
      guest_stars: {
        type: Sequelize.JSON // Usando JSON
      },
      crew: {
        type: Sequelize.JSON // Usando JSON
      },
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Episodes');
  }
};
