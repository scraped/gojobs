// Better error messages
require('pretty-error').start();
require('dotenv').config();

const chalk = require('chalk');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const config = require('./config');
const bootstrap = require('./config/bootstrap');

const {apiRouter, errorHandler} = require('./routers');
const {initMiddleware, ssrMiddleware} = require('./middleware');

const app = express();

app.set('port', config.port);

app.use(initMiddleware);
app.use(logger('dev'));
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cookieParser());

app.use(
  '/assets',
  express.static(path.resolve(__dirname, 'dist/assets')),
);

app.use('/api', apiRouter);

ssrMiddleware(app);

app.use(errorHandler);

bootstrap().then(() => {
  const port = app.get('port');
  app.listen(port, () => {
    console.log(chalk.blue(`Server is running on http://localhost:${port}`));
  });
});

process.on('unhandledRejection', err => {
  console.error('Unhandled rejection occured:', err);
  process.exit(1);
});
