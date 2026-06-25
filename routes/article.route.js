const router = require("express").Router();
const Controller = require("../controllers/article.controller");
const multer = require("multer");
const path = require("path");
const { preventGuests } = require("../middlewares/authentication");

// setting multer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname;
    cb(null, uniqueSuffix + ext);
  },
});
const upload = multer({ storage: storage });

router.get("/", Controller.renderArticlePage);

router.get("/add", preventGuests, Controller.addArticle);
router.post("/add", upload.single("thumbnailPicture"), Controller.postArticle);

router.get("/edit/:id", preventGuests, Controller.editArticle);
router.post(
  "/edit/:id",
  upload.single("thumbnailPicture"),
  Controller.postEditArticle,
);

router.get("/addbookmark/:id", preventGuests, Controller.addingBookmark);

router.get("/myBookmarks", preventGuests, Controller.getMyBookmarks);

router.get("/delete/:id", preventGuests, Controller.deleteArticle);

router.get("/:id", Controller.getDetailArticle);

module.exports = router;
