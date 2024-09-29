// migration-file.js
module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('MovieCasts', 'CastTmdbId', {
        type: Sequelize.INTEGER,
        allowNull: true, // ou false, dependendo do seu caso
      });
    },
    down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('MovieCasts', 'CastTmdbId');
    }
  };
  