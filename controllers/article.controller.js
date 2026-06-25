const { Article, User, Category } = require("../models");
const cutContent = require("../helpers/cutContent");
const nameSplit = require("../helpers/nameSplit");
const { Op } = require("sequelize");

class Controller {
  static async renderArticlePage(req, res) {
    try {
      let data = await Article.findAll();
      const currentUser = req.session.currentUser || null;
      res.render("articles", { data, cutContent, currentUser });
    } catch (error) {
      res.send(error);
    }
  }

  static async getDetailArticle(req, res) {
    try {
      const { id } = req.params;

      let data = await Article.findByPk(id, {
        include: {
          model: User,
        },
      });

      res.render("detailArticle", { data, nameSplit });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = Controller;
