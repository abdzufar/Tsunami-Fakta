const router = require("express").Router();
const Controller = require("../controllers/article.controller");

router.get("/", Controller.renderArticlePage);

router.get("/:id", Controller.getDetailArticle);

module.exports = router;
