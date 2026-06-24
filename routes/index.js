const router = require("express").Router();

const articleRoutes = require("./article.route.js");
const authenticationRoutes = require('./authentication.route.js')

router.get("/", (req, res) => {
<<<<<<< HEAD
  res.redirect("/articles");
});
router.use("/articles", articleRoutes);
=======
  res.redirect("/article");
});
router.use("/article", articleRoutes);
router.use('/authentication', authenticationRoutes);
>>>>>>> 8706d3de7ca07afdeef1e8d113ed8f96f8513b19

module.exports = router;
