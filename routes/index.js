const router = require("express").Router();

const articleRoutes = require("./article.route.js");

router.get("/", (req, res) => {
  res.redirect("/articles");
});
router.use("/articles", articleRoutes);

module.exports = router;
