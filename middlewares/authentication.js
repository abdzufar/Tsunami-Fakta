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

function preventGuests (req, res, next) {
  try {
    if (!req.session.currentUser) {
      res.redirect(`/authentication/login?errorMessage=${"Anda harus Login terlebih dahulu sebelum melakukan aksi ini."}`);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.send(error)
  }
}

module.exports = {
  preventLoginRegister,
  preventGuests
};