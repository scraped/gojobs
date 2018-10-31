const Boom = require('boom');

module.exports = function initMiddleware(req, res, next) {
  res.error = Boom;
  next();
};
