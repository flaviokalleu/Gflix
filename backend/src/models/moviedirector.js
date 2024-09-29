// models/movieDirector.js
module.exports = (sequelize, DataTypes) => {
  const MovieDirector = sequelize.define('MovieDirector', {
    movie_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Movies',
        key: 'id'
      }
    },
    director_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Directors',
        key: 'id'
      }
    }
  });

  return MovieDirector;
};