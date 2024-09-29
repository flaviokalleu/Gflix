'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TVShowDirector extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TVShowDirector.init({
    tv_show_id: DataTypes.INTEGER,
    director_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TVShowDirector',
  });
  return TVShowDirector;
};