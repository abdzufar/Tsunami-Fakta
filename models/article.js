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
      Article.belongsToMany(models.User, {through: models.ArticleBookmark});
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