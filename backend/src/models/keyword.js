module.exports = (sequelize, DataTypes) => {
    const Keyword = sequelize.define('Keyword', {
      name: DataTypes.STRING
    });
  
    Keyword.associate = function(models) {
      Keyword.belongsToMany(models.Movie, {
        through: 'MovieKeyword',
        foreignKey: 'keyword_id'
      });
    };

    Keyword.associate = (models) => {
      Keyword.belongsToMany(models.Movie, { through: 'MovieKeywords', foreignKey: 'keyword_id', otherKey: 'movie_id' });
    };
  
    return Keyword;
  };
  