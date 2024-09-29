// models/CreatedBy.js
module.exports = (sequelize, DataTypes) => {
    const CreatedBy = sequelize.define('CreatedBy', {
      name: DataTypes.STRING,
      original_name: DataTypes.STRING,
      gender: DataTypes.INTEGER,
      profile_path: DataTypes.STRING,
      series_tmdb_id: DataTypes.INTEGER,
    });
  
    CreatedBy.associate = (models) => {
      CreatedBy.belongsTo(models.Series, { foreignKey: 'series_tmdb_id' });
    };
  
    return CreatedBy;
  };
  