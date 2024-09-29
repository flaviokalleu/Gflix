'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SeriesCast extends Model {
        static associate(models) {
            SeriesCast.belongsTo(models.Series, { foreignKey: 'series_tmdb_id', as: 'series' });
            SeriesCast.belongsTo(models.Cast, { foreignKey: 'cast_id', as: 'cast' });
        }
    }

    SeriesCast.init({
        series_tmdb_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Series',
                key: 'tmdb_id',
            },
        },
        cast_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'casts', // Certifique-se de que o nome da tabela aqui é correto
                key: 'tmdb_id',
            },
        },
        
       
    }, {
        sequelize,
        modelName: 'SeriesCast',
        tableName: 'seriescasts', // Altere para 'seriescasts'
        timestamps: true,
    });

    return SeriesCast;
};
