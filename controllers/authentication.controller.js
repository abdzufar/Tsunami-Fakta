const { User } = require('../models/index');

class Controller {
  static async getRegisterForm(req, res) {
    try {
      const name = "Register a New Account"
      res.render('register', {name})
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}
module.exports = Controller;