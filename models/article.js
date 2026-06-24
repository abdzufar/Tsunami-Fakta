'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Article.belongsToMany(models.Category, {through: models.ArticleCategory});
      Article.belongsTo(models.User, {
        foreignKey: 'AuthorId', 
        as: 'Author'
      });
      Article.belongsToMany(models.User, {
        through: models.ArticleBookmark, 
        foreignKey: 'ArticleId',
        as: 'BookmarkedByUsers'
      });
    }
  }
  Article.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    AuthorId: DataTypes.INTEGER,
    thumbnailPicture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};