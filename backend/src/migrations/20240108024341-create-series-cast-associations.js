'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Criação da tabela Series
        await queryInterface.createTable('Series', {
            tmdb_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            overview: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            backdrop_path: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            first_air_date: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            last_air_date: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            number_of_episodes: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            number_of_seasons: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            original_language: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            status: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            popularity: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            vote_average: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            vote_count: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            homepage: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            poster_path: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
        });

        // Criação da tabela Cast
        await queryInterface.createTable('Cast', {
            tmdb_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            profile_path: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
        });

        // Criação da tabela SeriesCast
        await queryInterface.createTable('SeriesCast', {
            series_tmdb_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Series',
                    key: 'tmdb_id',
                    onDelete: 'CASCADE',
                },
            },
            cast_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Cast',
                    key: 'tmdb_id',
                    onDelete: 'CASCADE',
                },
            },
            character_name: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            profile_path: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
        });

        // Definindo a chave primária composta
        await queryInterface.addConstraint('SeriesCast', {
            fields: ['series_tmdb_id', 'cast_id'],
            type: 'primary key',
            name: 'pk_series_cast' // nome da chave primária
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Excluir a tabela SeriesCast
        await queryInterface.dropTable('SeriesCast');
        // Excluir a tabela Cast
        await queryInterface.dropTable('Cast');
        // Excluir a tabela Series
        await queryInterface.dropTable('Series');
    }
};
