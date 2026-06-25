const { sequelizeValidationErrorCheck } = require('../helpers/sequelizeValidationErrorCheck');
const { User, UserDetail } = require('../models/index');

class Controller {
  static async getUserDetail(req, res) {
    try {
      let currentUser = req.session.currentUser || null;
      currentUser = await User.findByPk(currentUser.id, {
        include: {
          model: UserDetail
        }
      });
      // res.send(currentUser)
      res.render('userDetails', {currentUser})
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  
  static async getUserDetailUpdate(req, res) {
    try {
      let currentUser = req.session.currentUser || null;
      currentUser = await User.findByPk(currentUser.id, {
        include: {
          model: UserDetail
        }
      });
      res.render('userDetailsUpdate', {currentUser})
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }  
  
  static async postUserDetailUpdate(req, res) {
    try {
      let currentUser = req.session.currentUser || null;
      currentUser = await User.findByPk(currentUser.id, {
        include: {
          model: UserDetail
        }
      });
      const userInput = req.body;
      if (!userInput.birthDate) userInput.birthDate = "1970-01-01";
      await UserDetail.update(userInput, {
        where: {
          id: currentUser.UserDetail.id
        }
      })
      res.redirect('/user')
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}
module.exports = Controller;