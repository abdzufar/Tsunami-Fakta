const { Article, User, Category } = require("../models");
const cutContent = require("../helpers/cutContent");
const nameSplit = require("../helpers/nameSplit");
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

  static async addArticle(req, res) {
    try {
      let data = await User.findAll({
        where: {
          role: {
            [Op.eq]: "Penulis",
          },
        },
      });

      res.render("addNewArticle");
    } catch (error) {
      res.send(error);
    }
  }

  static async postArticle(req, res) {
    try {
      const { title, content, AuthorId, thumbnailPicture } = req.body;
      let { destination, filename, mimetype } = req.file;
      mimetype = mimetype.split("/")[1];
      await Article.create({
        title,
        content,
        AuthorId,
        thumbnailPicture: `localhost:3000/${filename}`,
      });

      // console.log(req.body);
      // console.log(req.file);

      res.redirect("/article");
    } catch (error) {
      console.log(error);
      if (error.name === "SequelizeValidationError") {
        error = error.errors.map((el) => el.message);
      }
      res.send(error);
    }
  }
}

module.exports = Controller;
