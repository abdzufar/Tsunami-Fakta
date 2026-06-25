const router = require("express").Router();
const Controller = require("../controllers/article.controller");
const multer = require("multer");
const path = require("path");

// setting multer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    const ext = file.originalname;
    cb(null, ext);
  },
});
const upload = multer({ storage: storage });

router.get("/", Controller.renderArticlePage);

router.get("/add", Controller.addArticle);
router.post("/add", upload.single("thumbnailPicture"), Controller.postArticle);
// router.get("/bookmark", Controller.seeBookmarks);

router.get("/:id", Controller.getDetailArticle);

module.exports = router;
