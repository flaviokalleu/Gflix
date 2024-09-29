module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MovieNetworks', {
      movie_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Movies',
          key: 'id',
        },
        allowNull: false,
      },
      NetworkId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Networks',
          key: 'id',
        },
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MovieNetworks');
  },
};
