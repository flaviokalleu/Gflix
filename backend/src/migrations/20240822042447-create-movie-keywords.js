// migrations/[timestamp]-create-movie-keywords.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MovieKeywords', {
      movie_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Movies',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      keyword_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Keywords',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MovieKeywords');
  },
};
