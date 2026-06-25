const { sequelizeValidationErrorCheck } = require('../helpers/sequelizeValidationErrorCheck');
const { User, Article } = require('../models/index');
const bcrypt = require('bcryptjs');
class Controller {
  static async getRegisterForm(req, res) {
    try {
      const name = "Daftar Akun Baru";
      const currentUser = req.session.currentUser || null;
      const errorMessage = req.query.errorMessage ? JSON.parse(req.query.errorMessage) : {};
      const userInput = req.query.userInput ? JSON.parse(req.query.userInput) : {};
      res.render('register', {name, currentUser, errorMessage, userInput})
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  
  static async postRegisterForm(req, res) {
    try {
      const userInput = req.body;
      await User.create(userInput);
      res.redirect(`/authentication/login?successMessage=${"Akun berhasil dibuat."}`);
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
      const currentUser = req.session.currentUser || null;
      const errorMessage = req.query.errorMessage || "";
      const successMessage = req.query.successMessage || "";
      const userInput = req.query.userInput ? JSON.parse(req.query.userInput) : {};
      res.render('login', {name, currentUser, errorMessage, successMessage, userInput});
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
      });
      if (!userToTest) {
        throw new Error("Username atau Password tidak sesuai.");
      } else if (!bcrypt.compareSync(userInput.password, userToTest.password)) {
        throw new Error("Username atau Password tidak sesuai.");
      };
      const currentUser = await User.findOne({
        attributes: ['id', 'username', 'role'],
        where: {
          username: userInput.username
        }
      });
      req.session.currentUser = currentUser;
      console.log(req.session);
      res.redirect('/');
    } catch (error) {
      console.log(error);
      const userInput = encodeURIComponent(JSON.stringify(req.body))
      res.redirect(`/authentication/login?errorMessage=${error.message}&userInput=${userInput}`);
    }
  }
  
  static async postLogout(req, res) {
    try {
      res.clearCookie('connect.sid');
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).send('Could not log out.');
        }
        res.redirect('/');
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}
module.exports = Controller;