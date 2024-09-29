module.exports = (sequelize, DataTypes) => {
    const SeriesProductionCompanies = sequelize.define('SeriesProductionCompanies', {
      series_tmdb_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      production_company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    }, {
      timestamps: true,
    });
  
    return SeriesProductionCompanies;
  };
  