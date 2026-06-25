const {
  Article,
  User,
  Category,
  ArticleCategory,
  ArticleBookmark,
} = require("../models");
const cutContent = require("../helpers/cutContent");
const nameSplit = require("../helpers/nameSplit");
const { Op } = require("sequelize");

class Controller {
  static async renderArticlePage(req, res) {
    try {
      const currentUser = req.session.currentUser || null;
      const userInput = req.query || {};
      const data = await Article.getFilteredArticles(userInput);
      const categoriesArr = await Category.findAll({
        attributes: ["id", "name"],
        order: [["id", "ASC"]],
      });
      res.render("articles", {
        data,
        cutContent,
        currentUser,
        userInput,
        categoriesArr,
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async getDetailArticle(req, res) {
    try {
      const { id } = req.params;
      const currentUser = req.session.currentUser || null;

      let data = await Article.findByPk(id, {
        include: {
          model: User,
        },
      });

      let categoryNumber = await ArticleCategory.findAll({
        where: {
          ArticleId: id,
        },
        attributes: ["CategoryId"],
      });
      categoryNumber = categoryNumber[0].CategoryId;

      let categoryName = await Category.findByPk(categoryNumber);

      // cek apakah pernah dimasukan ke bookmarks
      let bookmarkCheck = await ArticleBookmark.findAll({
        where: {
          ArticleId: id,
        },
      });

      if (bookmarkCheck.length === 0) {
        // belum pernah masuk bookmark = false
        bookmarkCheck = false;
      } else {
        // masuk bookmark = true
        bookmarkCheck = true;
      }

      res.render("detailArticle", {
        data,
        nameSplit,
        currentUser,
        categoryName,
        bookmarkCheck,
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async addArticle(req, res) {
    try {
      const currentUser = req.session.currentUser || null;

      // getting category id
      let categoryData = await Category.findAll();

      let errorShow = "";
      if (req.query.error !== undefined) {
        errorShow = req.query.error.split(",").join(" and ");
      }

      res.render("addNewArticle", { currentUser, errorShow, categoryData });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async postArticle(req, res) {
    try {
      const { title, content, AuthorId, CategoryId } = req.body;
      let filename;
      if (req.file === undefined) {
        filename = "placeholder.png";
      } else {
        filename = req.file.filename;
      }
      let articleCreate = await Article.create({
        title,
        content,
        AuthorId,
        thumbnailPicture: `localhost:3000/${filename}`,
      });

      await ArticleCategory.create({
        ArticleId: articleCreate.id,
        CategoryId,
      });

      res.redirect("/article");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        error = error.errors.map((el) => el.message);
      }
      // res.send(error);
      res.redirect(`/article/add?error=${error}`);
    }
  }

  static async editArticle(req, res) {
    try {
      const currentUser = req.session.currentUser || null;

      let errorShow = "";
      if (req.query.error !== undefined) {
        errorShow = req.query.error.split(",").join(" and ");
      }

      const { id } = req.params;
      let data = await Article.findByPk(id);

      let categories = await Category.findAll();

      let categoryData = await ArticleCategory.findAll({
        where: {
          ArticleId: id,
        },
        attributes: ["CategoryId"],
      });

      categoryData = categoryData[0].CategoryId;

      res.render("editArticle.ejs", {
        data,
        currentUser,
        errorShow,
        categoryData,
        categories,
      });
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
      if (error.name === "SequelizeValidationError") {
        error = error.errors.map((el) => el.message);
      }
      // res.send(error);
      res.redirect(`/article/edit/${req.params.id}?error=${error}`);
    }
  }

  static async deleteArticle(req, res) {
    try {
      const { id } = req.params;
      await Article.destroy({
        where: {
          id: id,
        },
      });
      res.redirect("/");
    } catch (error) {
      res.send(error);
    }
  }

  static async addingBookmark(req, res) {
    try {
      // dapatkan id current user, dapatkan id article
      const currentUser = req.session.currentUser || null;
      const { id } = req.params;

      await ArticleBookmark.create({
        ArticleId: id,
        UserId: currentUser.id,
      });

      res.redirect(`/article/${id}`);
    } catch (error) {
      res.send(error);
    }
  }

  static async getMyBookmarks(req, res) {
    try {
      const currentUser = req.session.currentUser || null;
      const userInput = req.query || {};
      const data = await User.getBookmarksOfUser(currentUser, userInput);
      const categoriesArr = await Category.findAll({
        attributes: ["id", "name"],
        order: [["id", "ASC"]],
      });

      console.log(data);
      // res.send(data);
      res.render("myBookmarks", {
        currentUser,
        data,
        cutContent,
        categoriesArr,
        userInput,
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = Controller;
