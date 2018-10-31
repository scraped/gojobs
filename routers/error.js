const Boom = require('boom');

const SERVER_ERROR_CODE = 500;

// eslint-disable-next-line
module.exports = (err, req, res, next) => {
  let finalError = err;

  if (!finalError.isBoom) {
    finalError = Boom.boomify(finalError, {
      statusCode: SERVER_ERROR_CODE,
    });
  }

  const {payload} = finalError.output;
  const {statusCode, error, message} = payload;

  // Only show an error stack for actual server errors
  if (statusCode >= SERVER_ERROR_CODE) {
    console.log(finalError.stack);
  }

  const errMessage = req.xhr
    ? payload
    : `${statusCode} ${error}: ${message}`;

  res.status(statusCode).send(errMessage);
};
