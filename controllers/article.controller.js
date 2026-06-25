const { Article, User, Category } = require("../models");
const cutContent = require("../helpers/cutContent");
const nameSplit = require("../helpers/nameSplit");
const { Op } = require("sequelize");

class Controller {
  static async renderArticlePage(req, res) {
    try {
      let data = await Article.findAll();
      const currentUser = req.session.currentUser || null;
      console.log(currentUser);

      res.render("articles", { data, cutContent, currentUser });
    } catch (error) {
      res.send(error);
    }
  }

  static async getDetailArticle(req, res) {
    try {
      const { id } = req.params;
      const currentUser = req.session.currentUser || null;
      console.log(currentUser);

      let data = await Article.findByPk(id, {
        include: {
          model: User,
        },
      });

      res.render("detailArticle", { data, nameSplit, currentUser });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async addArticle(req, res) {
    try {
      const currentUser = req.session.currentUser || null;

      res.render("addNewArticle", { currentUser });
    } catch (error) {
      res.send(error);
    }
  }

  static async postArticle(req, res) {
    try {
      const { title, content, AuthorId, thumbnailPicture } = req.body;
      let { filename } = req.file;
      await Article.create({
        title,
        content,
        AuthorId,
        thumbnailPicture: `localhost:3000/${filename}`,
      });

      res.redirect("/article");
    } catch (error) {
      console.log(error);
      if (error.name === "SequelizeValidationError") {
        error = error.errors.map((el) => el.message);
      }
      res.send(error);
    }
  }

  static async editArticle(req, res) {
    try {
      const currentUser = req.session.currentUser || null;

      const { id } = req.params;
      let data = await Article.findByPk(id);

      res.render("editArticle.ejs", { data, currentUser });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async postEditArticle(req, res) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      if (req.file === undefined) {
        await Article.update(
          {
            title,
            content,
          },
          {
            where: {
              id: id,
            },
          },
        );
      } else {
        let { filename } = req.file;
        await Article.update(
          {
            title,
            content,
            thumbnailPicture: `localhost:3000/${filename}`,
          },
          {
            where: {
              id: id,
            },
          },
        );
      }

      res.redirect(`/article/${id}`);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async getMyBookmarks(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = Controller;
