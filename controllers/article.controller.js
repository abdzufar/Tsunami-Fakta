const { Article, User, Category, ArticleCategory } = require("../models");
const cutContent = require("../helpers/cutContent");
const nameSplit = require("../helpers/nameSplit");
const { Op, where } = require("sequelize");

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
      const currentUser = req.session.currentUser || null;

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
      res.send("ini halaman bookmark");
    } catch (error) {
      res.send(error);
    }
  }

  static async getMyBookmarks(req, res) {
    try {
      const currentUser = req.session.currentUser || null;
      const userInput = req.query || {};
      const where1 = {};
      const where2 = {};
      if (userInput.searchQuery)
        where1.title = { [Op.iLike]: `%${userInput.searchQuery}%` };
      if (userInput.categoryId) where2.id = +userInput.categoryId;
      let data = await User.findByPk(currentUser.id, {
        attributes: [],
        include: {
          model: Article,
          as: "BookmarkedArticles",
          include: {
            model: Category,
            where: where2,
          },
          where: where1,
        },
      });
      data = data ? data.BookmarkedArticles : [];
      const categoriesArr = await Category.findAll({
        attributes: ["id", "name"],
        order: [["id", "ASC"]],
      });
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
