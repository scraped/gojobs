const Boom = require('boom');

const SERVER_ERROR_CODE = 500;

// eslint-disable-next-line
module.exports = (err, req, res, next) => {
  if (!err.isBoom) {
    err = Boom.boomify(err, {
      statusCode: SERVER_ERROR_CODE
    });
  }

  const { payload } = err.output;
  const { statusCode, error, message } = payload;

  // Only show an error stack for actual server errors
  if (statusCode >= SERVER_ERROR_CODE) {
    console.log(err.stack);
  }

  const errMessage = req.xhr
    ? payload
    : `${statusCode} ${error}: ${message}`;

  res.status(statusCode).send(errMessage);
};
