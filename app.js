const config = require('./config');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const chalk = require('chalk');

const { createBundleRenderer } = require('vue-server-renderer');
const serverBundle = require(`${config.distDir}/vue-ssr-server-bundle`);
const clientManifest = require(`${config.distDir}/vue-ssr-client-manifest`);

const renderer = createBundleRenderer(serverBundle, {
  template: fs.readFileSync(`${config.srcDir}/index.html`, 'utf8'),
  clientManifest,
  runInNewContext: false
});

const jobsRouter = require('./routers/jobs');
const errorHandler = require('./routers/error');

const app = express();

app.set('port', config.port);

app.use(logger('dev'));
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, config.distDir)));

app.use('/api/jobs', jobsRouter);

app.get('*', (req, res) => {
  const context = {
    title: 'GTA Online Jobs',
    url: req.url
  };
  renderer.renderToString(context, (err, html) => {
    if (err) {
      console.log('Ошибка:', err);
      return res.send('Ошибка!');
    }
    res.send(html);
  });
});

errorHandler(app);

app.listen(app.get('port'), () => {
  console.log(
    chalk.bgBlue(' INFO '),
    chalk.blue(`Server is running at http://localhost:${app.get('port')}`)
  );
});
