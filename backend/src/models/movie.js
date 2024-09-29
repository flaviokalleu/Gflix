'use strict';

module.exports = (sequelize, DataTypes) => {
    const Movie = sequelize.define('Movie', {
        tmdb_id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        overview: {
            type: DataTypes.TEXT,
            allowNull: true // Permite que o resumo seja opcional
        },
        release_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        poster_path: {
            type: DataTypes.STRING,
            allowNull: true
        },
        backdrop_path: {
            type: DataTypes.STRING,
            allowNull: true
        },
        popularity: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        vote_average: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        vote_count: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        trailer_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        player_links: {
            type: DataTypes.STRING, // Armazena um único link
            allowNull: true // Permite que o link seja opcional, altere para false se for obrigatório
        }
    }, {
        tableName: 'movies', // Nome da tabela no banco de dados
        timestamps: true // Habilita os campos createdAt e updatedAt
    });

    // Associações
    Movie.associate = (models) => {
        // Associação com os gêneros (Genres)
        Movie.belongsToMany(models.Genre, {
            through: 'MovieGenres',
            foreignKey: 'movie_id',
            otherKey: 'genre_id',
            as: 'genres' // Alias 'genres' permite o uso de addGenres
        });

        // Associação com o elenco (Casts)
        Movie.belongsToMany(models.Cast, {
            through: models.MovieCast,
            foreignKey: 'movie_id',
            otherKey: 'cast_id',
            as: 'casts' // Alias 'casts' permite o uso de addCasts
        });

        // Associação com os diretores (Directors)
        Movie.belongsToMany(models.Director, {
            through: 'MovieDirector',
            foreignKey: 'movie_id',
            otherKey: 'director_id', // Certifique-se de que a tabela MovieDirector tenha a chave estrangeira correta
            as: 'directors'
        });

        // Associação com palavras-chave (Keywords)
        Movie.belongsToMany(models.Keyword, {
            through: 'MovieKeywords',
            foreignKey: 'movie_id',
            otherKey: 'keyword_id',
            as: 'keywords' // Alias 'keywords' permite o uso de addKeywords
        });

        // Associação com redes de TV (Networks)
        Movie.belongsToMany(models.Network, {
            through: 'MovieNetworks',
            foreignKey: 'movie_id',
            otherKey: 'network_id', // Certifique-se de que a tabela MovieNetworks tenha a chave estrangeira correta
            as: 'networks'
        });

        // Associação com MovieCast para relacionar com o elenco
        Movie.hasMany(models.MovieCast, {
            foreignKey: 'movie_id',
            as: 'movieCasts' // Alias 'movieCasts' para uso na aplicação
        });
    };

    return Movie;
};
