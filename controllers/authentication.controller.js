const { sequelizeValidationErrorCheck } = require('../helpers/sequelizeValidationErrorCheck');
const { User, Article } = require('../models/index');
const bcrypt = require('bcryptjs');
class Controller {
  static async getRegisterForm(req, res) {
    try {
      const name = "Daftar Akun Baru";
      const errorMessage = req.query.errorMessage ? JSON.parse(req.query.errorMessage) : {};
      const userInput = req.query.userInput ? JSON.parse(req.query.userInput) : {};
      console.log(userInput);
      res.render('register', {name, errorMessage, userInput})
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
      if (error.name !== "SequelizeValidationError") {
        console.log(error);
        res.send(error);
      } else {
        const errorObj = sequelizeValidationErrorCheck(error);
        const userInput = encodeURIComponent(JSON.stringify(req.body));
        res.redirect(`/authentication/register?errorMessage=${errorObj}&userInput=${userInput}`);
      }
    }
  }
  
  static async getLoginForm(req, res) {
    try {
      const name = "Login Akun";
      const errorMessage = req.query.errorMessage || "";
      const userInput = req.query.userInput ? JSON.parse(req.query.userInput) : {};
      res.render('login', {name, errorMessage, userInput});
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
      if (!userToTest) {
        throw new Error("Username atau Password tidak sesuai.");
      } else if (!bcrypt.compareSync(userInput.password, userToTest.password)) {
        throw new Error("Username atau Password tidak sesuai.");
      }
      res.redirect('/');
    } catch (error) {
      console.log(error);
      const userInput = encodeURIComponent(JSON.stringify(req.body))
      res.redirect(`/authentication/login?errorMessage=${error.message}&userInput=${userInput}`);
    }
  }
}
module.exports = Controller;