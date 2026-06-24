const { sequelizeValidationErrorCheck } = require('../helpers/sequelizeValidationErrorCheck');
const { User, Article } = require('../models/index');
const bcrypt = require('bcryptjs');
class Controller {
  static async getRegisterForm(req, res) {
    try {
      const name = "Daftar Akun Baru"
      res.render('register', {name})
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  
  static async postRegisterForm(req, res) {
    try {
      const userInput = req.body;
      await User.create(userInput);
      res.redirect('/');
    } catch (error) {
      sequelizeValidationErrorCheck(req, res, error);
    }
  }
  
  static async getLoginForm(req, res) {
    try {
      const name = "Login Akun"
      let data = await Article.findByPk(1, {
        include: {
          model: User,
          as: "Author"
        },
      });
      res.send(data)
      // res.render('login', {name})
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  
  static async postLoginForm(req, res) {
    try {
      const userInput = req.body;
      console.log(userInput);
      const userToTest = await User.findOne({
        attributes: ['password'],
        where: {
          username: userInput.username
        }
      })
      console.log(userToTest);
      if (!userInput) {
        throw new Error("Username atau Password tidak sesuai.");
      } else if (!bcrypt.compareSync(userInput.password, userToTest.password)) {
        throw new Error("Username atau Password tidak sesuai.");
      }
      res.redirect('/');
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}
module.exports = Controller;