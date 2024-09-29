module.exports = (sequelize, DataTypes) => {
    const Network = sequelize.define('Network', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tmdb_network_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true // Se necessário, pode ser removido se não for obrigatório ser único
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      logo_path: {
        type: DataTypes.STRING
      }
    }, {});
    
    Network.associate = function(models) {
      Network.belongsToMany(models.Movie, {
        through: 'MovieNetwork',
        foreignKey: 'network_id'
      });
    };
  
    return Network;
  };
  