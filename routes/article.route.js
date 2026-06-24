const router = require("express").Router();
const Controller = require("../controllers/article.controller");

router.get("/", (req, res) => {
  console.log("masuk");
  res.send("ini dari news routes");
});

module.exports = router;
