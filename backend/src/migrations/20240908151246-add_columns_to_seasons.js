module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Seasons', 'vote_average', {
        type: Sequelize.FLOAT,
        allowNull: true,
      }),
      // A linha abaixo foi comentada ou removida
      // queryInterface.addColumn('Seasons', 'episode_count', {
      //   type: Sequelize.INTEGER,
      //   allowNull: true,
      // }),
      //queryInterface.addColumn('Seasons', 'poster_path', {
      //  type: Sequelize.STRING,
      //  allowNull: true,
     // }),
      //queryInterface.addColumn('Seasons', 'overview', {
      //  type: Sequelize.TEXT,
      //  allowNull: true,
     // }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Seasons', 'vote_average'),
      // A linha abaixo foi comentada ou removida
      // queryInterface.removeColumn('Seasons', 'episode_count'),
      //queryInterface.removeColumn('Seasons', 'poster_path'),
      //queryInterface.removeColumn('Seasons', 'overview'),
    ]);
  }
};
