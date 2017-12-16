const config = require('./config');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const history = require('connect-history-api-fallback');
const chalk = require('chalk');
const { resolveSrc } = require('./utils');
const vue = require('vue');
const { createBundleRenderer } = require('vue-server-renderer');

const jobsRouter = require('./routers/jobs');
const errorHandler = require('./routers/error');

const renderer = createBundleRenderer(serverBundle, {
  template: fs.readFileSync(resolveSrc('index.html')),
  runInNewContext: false
});

const app = express();

app.set('port', config.port);
app.disable('x-powered-by');

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(resolveSrc()));

app.use('/api/jobs', jobsRouter);

app.use(history());

errorHandler(app);

app.get('*', (req, res) => {
  const context = { url: req.url };
  renderer.renderToString(context, (err, html) => {
    res.end(html);
  });
});

// Run server
app.listen(app.get('port'), () => {
  console.log(
    chalk.bgBlue(' INFO '),
    chalk.blue(`Server is running at http://localhost:${app.get('port')}`)
  );
});
