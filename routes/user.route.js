const router = require('express').Router();
const userController = require('../controllers/user.controller')
const { preventGuests } = require('../middlewares/authentication')

// route: '/user'
router.use(preventGuests)
router.get('/', userController.getUserDetail)
router.get('/updateDetails', userController.getUserDetailUpdate)
router.post('/updateDetails', userController.postUserDetailUpdate)

module.exports = router;