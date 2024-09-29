// movieNetworks.js
module.exports = (sequelize, DataTypes) => {
  const MovieNetwork = sequelize.define('MovieNetwork', {
      movie_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
              model: 'Movies',
              key: 'id',
          },
      },
      network_id: { // Certifique-se de usar 'network_id' em vez de 'NetworkId'
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
              model: 'Networks',
              key: 'id',
          },
      },
  }, {
      timestamps: true,
      tableName: 'MovieNetworks',
  });

  return MovieNetwork;
};

