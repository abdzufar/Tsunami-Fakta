const router = require("express").Router();

const articleRoutes = require("./article.route.js");

router.get("/", (req, res) => {
  res.redirect("/news");
});
router.use("/news", newsRoutes);

module.exports = router;
