'use strict';

module.exports = (sequelize, DataTypes) => {
    const Series = sequelize.define('Series', {
        tmdb_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        overview: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        backdrop_path: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        first_air_date: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        last_air_date: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        number_of_episodes: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        number_of_seasons: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        original_language: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        popularity: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        vote_average: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        vote_count: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        homepage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        poster_path: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        timestamps: true,
    });

    // Associations
    Series.associate = (models) => {
        Series.hasMany(models.Season, { foreignKey: 'series_tmdb_id', as: 'seasons' });
        Series.belongsToMany(models.Genre, {
            through: 'SeriesGenres',
            foreignKey: 'series_tmdb_id',
            otherKey: 'genre_id',
            as: 'genres',
        });
        Series.belongsToMany(models.ProductionCompany, {
            through: 'SeriesProductionCompanies',
            foreignKey: 'series_tmdb_id',
            otherKey: 'production_company_id',
            as: 'production_companies',
        });
        Series.belongsToMany(models.Cast, {
            through: models.SeriesCast,
            foreignKey: 'series_tmdb_id', // Foreign key for Series in the join table
            otherKey: 'cast_id', // Foreign key for Cast in the join table
            as: 'casts' // This alias should be consistent with your fetch query
        });
        
    };

    return Series;
};
