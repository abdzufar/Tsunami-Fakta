"use strict";
const { Model } = require("sequelize");
const { Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Article.belongsToMany(models.Category, {
        through: models.ArticleCategory,
      });
      Article.belongsTo(models.User, {
        foreignKey: "AuthorId",
      });
      Article.belongsToMany(models.User, {
        through: models.ArticleBookmark,
        foreignKey: "ArticleId",
        as: "BookmarkedByUsers",
      });
    }

    static async getFilteredArticles(userInput) {
      const where1 = {};
      const where2 = {};
      if (userInput.searchQuery) where1.title = { [Op.iLike]: `%${userInput.searchQuery}%` };
      if (userInput.categoryId) where2.id = +userInput.categoryId;
      let data = await Article.findAll({
        include: {
          model: sequelize.models.Category,
          where: where2,
        },
        where: where1,
      })
      return data;
    }
  }
  Article.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Title required!",
          },
          notEmpty: {
            msg: "Title required!",
          },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Content required!",
          },
          notEmpty: {
            msg: "Content required!",
          },
        },
      },
      AuthorId: DataTypes.INTEGER,
      thumbnailPicture: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Article",
    },
  );
  return Article;
};
