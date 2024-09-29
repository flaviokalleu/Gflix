module.exports = (sequelize, DataTypes) => {
    const Trailer = sequelize.define('Trailer', {
      name: DataTypes.STRING,
      site: DataTypes.STRING,
      key: DataTypes.STRING,
      type: DataTypes.STRING
    });
  
    Trailer.associate = function(models) {
      Trailer.belongsToMany(models.Movie, {
        through: 'MovieTrailer',
        foreignKey: 'trailer_id'
      });
    };
  
    return Trailer;
  };
  