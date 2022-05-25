const {responseFormater} = require('../utils');
// const { developerEmail, backendURL } = require('../config');
// const winston = require('./winston');

const errorHandlerMiddleware = (error, req, res) => {
  // const err = `${error.statusCode || 500} - ${error.message} - ${error.data} - ${req.originalUrl
  // } - ${req.method} - ${req.ip}`;

  // winston.error(err);

  // if (!backendURL.includes('localhost') && undefined != error.statusCode && error.statusCode != 404) {
  //   functions.sendEmail(developerEmail, message.apiErrorEmailSubject, err);
  // }

  res.send(
    responseFormater(
      error.statusCode || 500,
      error.message,
      error.data
    )
  );
};

function errorHandler(error) {
  const err = JSON.stringify(error);
  winston.error(err);

  // if (!backendURL.includes('localhost')) {
  //   functions.sendEmail(developerEmail, message.apiErrorEmailSubject, err);
  // }
}

module.exports = {
  errorHandlerMiddleware,
  errorHandler,
};
