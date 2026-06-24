module.exports = {
  sequelizeValidationErrorCheck: (req, res, error) => {
    if (error.name !== "SequelizeValidationError") {
      console.log(error);
      res.send(error);
    } else {
      let errorObj = {};
      error.errors.forEach(element => {
        if (!errorObj[element.path]) errorObj[element.path] = [];
        errorObj[element.path].push(element.message);
      })
      res.send(errorObj);
    }
  }
};