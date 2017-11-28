const chalk = require('chalk');
const Boom = require('boom');

module.exports = app => {

  // 404
  app.use((req, res) => {
    let errMessage = req.xhr ? Boom.notFound().output.payload : '404 Not Found';

    res.status(404).send(errMessage);
  });

  // Everything else
  app.use((err, req, res, next) => {
    console.log(chalk.bgRed(' ERROR '), chalk.reset(err.stack));

    err = err.isBoom ? err : Boom.boomify(err, { statusCode: 500 });

    let { payload } = err.output;
    let { statusCode, error, message } = payload;

    let errMessage = req.xhr ? payload : `${statusCode} ${error}: ${message}`;

    res.status(statusCode).send(errMessage);
  });

};
