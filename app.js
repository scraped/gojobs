const config = require('./config');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const chalk = require('chalk');
require('pretty-error').start();

const jobsRouter = require('./routers/jobs');
const SSR = require('./routers/ssr');
// const errorHandler = require('./routers/error');

const app = express();

app.set('port', config.port);

app.use(logger('dev'));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, config.distDir, 'assets')));

app.use('/api/jobs', jobsRouter);

SSR(app);

// errorHandler(app);

// Run server
app.listen(app.get('port'), () => {
  console.log(
    chalk.bgBlue(' INFO '),
    chalk.blue(`Server is running at http://localhost:${app.get('port')}`)
  );
});
