const config = require('./config');
const chalk = require('chalk');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const prettyError = require('pretty-error');
const cookieParser = require('cookie-parser');

const {apiRouter} = require('./routers');
const {ssrMiddleware} = require('./lib/ssr');
const {connectDb} = require('./lib/db');

// better error messages
prettyError.start();

const app = express();

app.set('port', config.port);

app.use(logger('dev'));
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cookieParser());

app.use(
  '/assets',
  express.static(path.resolve(__dirname, 'dist/assets'))
);

app.use('/api', apiRouter);

ssrMiddleware(app);

connectDb(() => {
  app.listen(app.get('port'), () => {
    const port = app.get('port');
    console.log(chalk.blue(`Server is running on http://localhost:${port}`));
  });
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection occured:', err.stack);
  process.exit(1);
});
