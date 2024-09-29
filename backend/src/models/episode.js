module.exports = (sequelize, DataTypes) => {
  const Episode = sequelize.define('Episode', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    season_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    episode_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    overview: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    vote_average: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    runtime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    air_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    production_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    still_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    guest_stars: {
      type: DataTypes.JSON, // Armazenar como JSON se for uma lista
      allowNull: true,
    },
    crew: {
      type: DataTypes.JSON, // Armazenar como JSON se for uma lista
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: true,
  });

  // Associações
  Episode.associate = (models) => {
    Episode.belongsTo(models.Season, { foreignKey: 'season_id', as: 'season' });
  };

  return Episode;
};
