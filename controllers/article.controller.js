const { Article, User, Category } = require("../models");
const cutContent = require("../helpers/cutContent");
const { Op } = require("sequelize");

class Controller {
  static async renderArticlePage(req, res) {
    try {
      let data = await Article.findAll();

      res.render("articles", { data, cutContent });
    } catch (error) {
      res.send(error);
    }
  }

  static async getDetailArticle(req, res) {
    try {
      const { id } = req.params;

      let categoriesData = await Category.findAll();

      let data = await Article.findByPk(id, {
        include: {
          model: User,
          attributes: ["username"],
        },
      });
      // let data = await Article.findAll({
      //   include: {
      //     model: User,
      //     attributes: ["username"],
      //   },
      //   where: {
      //     id: {
      //       [Op.eq]: id,
      //     },
      //   },
      // });
      console.log(categoriesData);

      res.render("detailArticle", { data });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = Controller;
