'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TVShow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TVShow.init({
    tmdb_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    overview: DataTypes.TEXT,
    first_air_date: DataTypes.DATE,
    last_air_date: DataTypes.DATE,
    poster_path: DataTypes.STRING,
    backdrop_path: DataTypes.STRING,
    popularity: DataTypes.FLOAT,
    vote_average: DataTypes.FLOAT,
    vote_count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TVShow',
  });
  return TVShow;
};