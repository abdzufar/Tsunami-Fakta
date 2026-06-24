module.exports = {
  sequelizeValidationErrorCheck: (error) => {
    let errorObj = {};
    error.errors.forEach(element => {
      if (!errorObj[element.path]) errorObj[element.path] = [];
      errorObj[element.path].push(element.message);
    });
    for (const errorType in errorObj) {
      errorObj[errorType] = errorObj[errorType].join('\n');
    }
    errorObj = encodeURIComponent(JSON.stringify(errorObj));
    return errorObj;
  }
};