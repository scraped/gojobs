const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const webpack = require('webpack');
const chalk = require('chalk');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const MemoryFileSystem = require('memory-fs');
const clientConfig = require('./webpack.client.config');
const serverConfig = require('./webpack.server.config');

module.exports = setupDevServer;

/**
 * Calls updateCallback({ bundle, clientManifest, template })
 * when something changes
 * @param {object} app express instance
 * @param {function} updateCallback callback to be invoked
 * @returns {Promise} fullfilled when we're ready
 */
function setupDevServer(app, updateCallback) {
  let resolveReadyPromise;

  const readyPromise = new Promise(r => {
    resolveReadyPromise = r;
  });

  let bundle;
  let clientManifest;
  let template;

  const templatePath = './src/index.html';

  // ***************************
  // Utilities
  // ***************************
  function update() {
    if (bundle && clientManifest) {
      resolveReadyPromise();
      updateCallback({ bundle, clientManifest, template });
    }
  }

  function readFileSync(fs, filename) {
    const pathToFile = path.join(clientConfig.output.path, filename);
    return JSON.parse(fs.readFileSync(pathToFile, 'utf-8'));
  }

  function updateTemplate() {
    template = fs.readFileSync(templatePath, 'utf-8');
  }

  // ***************************
  // 0. Watch template file
  // ***************************
  updateTemplate();

  chokidar.watch(templatePath).on('change', () => {
    updateTemplate();
    update();
    console.log(chalk.blue('Template updated'));
  });

  // ***************************
  // 1. Watch client files
  // ***************************
  const clientCompiler = webpack(clientConfig);
  const serverCompiler = webpack(serverConfig);

  const webpackDevMiddlewareInstance = webpackDevMiddleware(
    clientCompiler,
    {
      publicPath: clientConfig.output.publicPath,
      stats: {
        colors: true,
        modules: false
      }
    }
  );

  app.use(webpackDevMiddlewareInstance);

  clientCompiler.plugin('done', stats => {
    stats = stats.toJson();
    stats.errors.forEach(console.error);
    stats.warnings.forEach(console.warn);

    clientManifest = readFileSync(
      webpackDevMiddlewareInstance.fileSystem,
      'vue-ssr-client-manifest.json'
    );

    update();
  });

  app.use(webpackHotMiddleware(clientCompiler, {
    heartbeat: 5000
  }));

  // ***************************
  // 2. Watch server bundle
  // ***************************
  const MFS = new MemoryFileSystem();
  serverCompiler.outputFileSystem = MFS;

  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;
    stats = stats.toJson();
    stats.errors.forEach(console.error);
    stats.warnings.forEach(console.warn);

    bundle = readFileSync(MFS, 'vue-ssr-server-bundle.json');

    update();
  });

  return readyPromise;
}
