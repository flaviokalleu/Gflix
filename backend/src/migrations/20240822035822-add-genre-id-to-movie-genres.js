module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('MovieGenres', 'GenreId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Genres',  // Nome da tabela de gêneros
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: true // ou false, se a coluna não deve permitir valores nulos
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('MovieGenres', 'GenreId');
  }
};
