module.exports = (sequelize, DataTypes) => {
  const Season = sequelize.define('Season', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    series_tmdb_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    season_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    air_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    episode_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    overview: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    poster_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vote_average: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  }, {
    timestamps: true,
  });

  // Associações
  Season.associate = (models) => {
    Season.belongsTo(models.Series, { foreignKey: 'series_tmdb_id', as: 'series' });
    Season.hasMany(models.Episode, { foreignKey: 'season_id', as: 'episodes' });
  };

  return Season;
};
