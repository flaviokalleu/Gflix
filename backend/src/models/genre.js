module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define('Genre', {
    tmdb_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
  });

  // Associações
  Genre.associate = (models) => {
    Genre.belongsToMany(models.Series, {
      through: 'SeriesGenres',
      foreignKey: 'genre_id',
      otherKey: 'series_tmdb_id',
      as: 'series',
    });
  };
  Genre.associate = (models) => {
    Genre.belongsToMany(models.Movie, { through: 'MovieGenres', foreignKey: 'genre_id', otherKey: 'movie_id' });
  };

  return Genre;
};
