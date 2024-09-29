'use strict';

module.exports = (sequelize, DataTypes) => {
    const Cast = sequelize.define('Cast', {
        id: {  // Novo campo ID
            type: DataTypes.INTEGER,
            autoIncrement: true, // Gerar automaticamente
            primaryKey: true, // Define como chave primária
        },
        tmdb_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        tmdb_cast_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        profile_path: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        character_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'casts',
        timestamps: true,
    });

    // Associações
    Cast.associate = (models) => {
        // Relacionamento com séries
        Cast.belongsToMany(models.Series, {
            through: models.SeriesCast,
            foreignKey: 'cast_id',
            otherKey: 'series_tmdb_id',
            as: 'series'
        });

        // Relacionamento com filmes
        Cast.hasMany(models.MovieCast, { foreignKey: 'cast_id' });
        Cast.belongsToMany(models.Movie, {
            through: models.MovieCast,
            foreignKey: 'cast_id',
            otherKey: 'movie_id',
            as: 'movies'
        });
    };

    return Cast;
};
