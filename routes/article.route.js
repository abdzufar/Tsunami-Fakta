const router = require("express").Router();
const Controller = require("../controllers/article.controller");

router.get("/", Controller.renderArticlePage);

module.exports = router;
