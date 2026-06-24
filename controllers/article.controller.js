const { Article } = require("../models");
const cutContent = require("../helpers/cutContent");

class Controller {
  static async renderArticlePage(req, res) {
    try {
      let data = await Article.findAll();
      console.log(data);

      res.render("articles", { data, cutContent });
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = Controller;
