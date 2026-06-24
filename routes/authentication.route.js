const router = require('express').Router();
const authenticationController = require('../controllers/authentication.controller')

// route: '/authentication'
router.get('/register', authenticationController.getRegisterForm)

module.exports = router;