const router = require('express').Router();
const authenticationController = require('../controllers/authentication.controller')

// route: '/authentication'
router.get('/register', authenticationController.getRegisterForm)
router.post('/register', authenticationController.postRegisterForm)
router.get('/login', authenticationController.getLoginForm)
router.post('/login', authenticationController.postLoginForm)

module.exports = router;