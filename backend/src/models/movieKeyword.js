// movieKeyword.js
module.exports = (sequelize, DataTypes) => {
    const MovieKeyword = sequelize.define('MovieKeyword', {
        movie_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        keyword_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: true,
        tableName: 'MovieKeywords', // O nome da tabela deve corresponder ao nome definido aqui
    });

    return MovieKeyword;
};
