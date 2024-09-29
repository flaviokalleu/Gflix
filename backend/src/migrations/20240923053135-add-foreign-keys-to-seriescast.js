'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addConstraint('seriescast', {
            fields: ['series_tmdb_id'],
            type: 'foreign key',
            name: 'fk_series_tmdb_id', // nome da restrição
            references: {
                table: 'Series',
                field: 'tmdb_id',
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
        });

        await queryInterface.addConstraint('seriescast', {
            fields: ['cast_id'],
            type: 'foreign key',
            name: 'fk_cast_id', // nome da restrição
            references: {
                table: 'Cast',
                field: 'tmdb_id',
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeConstraint('seriescast', 'fk_series_tmdb_id');
        await queryInterface.removeConstraint('seriescast', 'fk_cast_id');
    }
};
