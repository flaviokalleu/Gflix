'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TVShowCast extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TVShowCast.init({
    tv_show_id: DataTypes.INTEGER,
    cast_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TVShowCast',
  });
  return TVShowCast;
};