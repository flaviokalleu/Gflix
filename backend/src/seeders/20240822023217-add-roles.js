module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', [
      {
        name: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', null, {});
  }
};
