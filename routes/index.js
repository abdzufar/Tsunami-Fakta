const router = require("express").Router();

const newsRoutes = require("./news.js");

router.get("/", (req, res) => {
  res.redirect("/news");
});
router.use("/news", newsRoutes);

module.exports = router;
