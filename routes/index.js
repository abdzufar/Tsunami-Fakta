const router = require("express").Router();

const articleRoutes = require("./article.route.js");
const authenticationRoutes = require("./authentication.route.js");
const userRoutes = require('./user.route.js')

router.get("/", (req, res) => {
  res.redirect("/article");
});
router.use("/article", articleRoutes);
router.use("/authentication", authenticationRoutes);
router.use('/user/', userRoutes)

module.exports = router;
