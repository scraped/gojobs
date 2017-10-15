const config = require('./config');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const history = require('connect-history-api-fallback');
const chalk = require('chalk');
const Boom = require('boom');
const errorhandler = require('errorhandler');

const app = express();

app.disable('x-powered-by');
app.set('port', config.port);

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler())
}
app.use(logger('dev'));
app.use(history(__dirname));
app.use(bodyParser());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, config.distDir)));

// app.get('/jobs', (req, res) => {
//   res.send({'hello': 'world!'});
// });

app.use((err, res, req, next) => {
  console.log(chalk.bgRed(' ERROR '), chalk.reset(err.stack));
  if (res.xhr) {
    req.send(Boom.badImplementation().output.payload);
  } else {
    req.send('Error occured');
  }
});

// Run server
app.listen(app.get('port'), () => {
  console.log(
    chalk.bgBlue(' INFO '),
    chalk.blue(`Server is running at http://localhost:${app.get('port')}`)
  );
});
