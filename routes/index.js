const router = require("express").Router();
const Controller = require("../controllers/Controller");

router.get("/", Controller.renderLandingPage);

module.exports = router;
