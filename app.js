const config = require('./config');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// better error messages & console.log respectively
require('pretty-error').start();
require('./lib/log');

const jobsRouter = require('./routers/jobs');
const SSR = require('./routers/ssr');

const app = express();

app.set('port', config.port);

app.use(logger('dev'));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  '/assets',
  express.static(path.resolve(__dirname, 'dist/assets'))
);

app.use('/api/jobs', jobsRouter);

SSR(app);

app.listen(app.get('port'), () => {
  const port = app.get('port');
  console.log('Server is running at:');
  console.log(`http://localhost:${port}`);
});
