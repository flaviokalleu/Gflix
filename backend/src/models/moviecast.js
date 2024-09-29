'use strict';

module.exports = (sequelize, DataTypes) => {
  const MovieCast = sequelize.define('MovieCast', {
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Definir como não nulo, pois é obrigatório para a relação
      references: {
        model: 'Movies',
        key: 'id'
      },
      onDelete: 'CASCADE' // Se um filme for removido, também remove as entradas relacionadas
    },
    cast_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Definir como não nulo, pois é obrigatório para a relação
      references: {
        model: 'Casts',
        key: 'id'
      },
      onDelete: 'CASCADE' // Se um elenco for removido, também remove as entradas relacionadas
    }
  }, {
    tableName: 'moviecasts', // Nome da tabela no banco de dados
    timestamps: true, // Ativa os campos createdAt e updatedAt
  });

  // Associações
  MovieCast.associate = (models) => {
    // Relacionamento com Movie
    MovieCast.belongsTo(models.Movie, { foreignKey: 'movie_id', onDelete: 'CASCADE' });
    
    // Relacionamento com Cast
    MovieCast.belongsTo(models.Cast, { foreignKey: 'cast_id', onDelete: 'CASCADE' });
  };

  return MovieCast;
};
