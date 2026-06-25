function preventLoginRegister (req, res, next) {
  try {
    if (req.session.currentUser) {
      res.redirect('/');
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.send(error)
  }
}

module.exports = {
  preventLoginRegister
};