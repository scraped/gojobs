const config = require('./config');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const history = require('connect-history-api-fallback');

const app = express();

app.disable('x-powered-by');
app.set('port', config.port);

// Middleware
app.use(logger('dev'));
app.use(history());
app.use(bodyParser());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, config.distDir)));

// Run server
app.listen(app.get('port'), () => {
  console.log(`Server is running at http://localhost:${app.get('port')}`);
});
