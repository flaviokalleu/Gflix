module.exports = (sequelize, DataTypes) => {
  const ProductionCompany = sequelize.define('ProductionCompany', {
    tmdb_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,  // Define tmdb_id como a chave primária
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logo_path: {
      type: DataTypes.STRING,  // Campo para o caminho do logo
      allowNull: true,         // Permite que seja nulo se não houver logo
    },
    origin_country: {
      type: DataTypes.STRING,  // Campo para o país de origem
      allowNull: true,         // Permite que seja nulo se não houver informação
    },
  }, {
    timestamps: true,
  });

  // Associações
  ProductionCompany.associate = (models) => {
    ProductionCompany.belongsToMany(models.Series, {
      through: 'SeriesProductionCompanies',
      foreignKey: 'production_company_id',
      otherKey: 'series_tmdb_id',
      as: 'series',
    });
  };

  return ProductionCompany;
};
