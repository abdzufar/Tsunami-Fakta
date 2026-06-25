const router = require('express').Router();
const authenticationController = require('../controllers/authentication.controller')
const { preventLoginRegister } = require('../middlewares/authentication')

// route: '/authentication'

router.post('/logout', authenticationController.postLogout)

router.use(preventLoginRegister);
router.get('/register', authenticationController.getRegisterForm)
router.post('/register', authenticationController.postRegisterForm)
router.get('/login', authenticationController.getLoginForm)
router.post('/login', authenticationController.postLoginForm)

module.exports = router;