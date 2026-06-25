const { Article, User, Category } = require("../models");
const cutContent = require("../helpers/cutContent");
const nameSplit = require("../helpers/nameSplit");
const { Op, where } = require("sequelize");

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
      let { destination, filename, mimetype } = req.file;
      mimetype = mimetype.split("/")[1];
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

  static async getMyBookmarks(req, res) {
    try {
      const currentUser = req.session.currentUser || null;
      const userInput = req.query || {};
      const where1 = {};
      const where2 = {};
      if (userInput.searchQuery) where1.title = {[Op.iLike]: `%${userInput.searchQuery}%`};
      if (userInput.categoryId) where2.id = +userInput.categoryId;
      let data = await User.findByPk(currentUser.id, {
        attributes: [],
        include: {
          model: Article,
          as: "BookmarkedArticles",
          include: {
            model: Category,
            where: where2
          },
          where: where1
        },
      })
      data = data ? data.BookmarkedArticles : [];
      const categoriesArr = await Category.findAll({
        attributes: ['id', 'name'],
        order: [
          ['id', 'ASC']
        ]
      })
      // res.send(data);
      res.render('myBookmarks', {currentUser, data, cutContent, categoriesArr, userInput});
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = Controller;
