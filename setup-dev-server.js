const config = require('./config');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const clientConfig = require('./webpack.client.config');
const serverConfig = require('./webpack.server.config');
const MemoryFileSystem = require('memory-fs');

// Calls updateCallback({ bundle, clientManifest, template })
// when something changes.
function setupDevServer(app, updateCallback) {
  let readyPromiseResolve;
  let readyPromise = new Promise(resolve => {
    readyPromiseResolve = resolve;
  });

  let bundle,
    clientManifest,
    template;

  const clientCompiler = webpack(clientConfig);
  const serverCompiler = webpack(serverConfig);
  const templatePath = path.join(config.srcDir, 'index.html');

  // Utilities
  function update() {
    if (bundle && clientManifest) {
      readyPromiseResolve();
      updateCallback({ bundle, clientManifest, template });
    }
  }

  function readFileSync(fs, filename) {
    const pathToFile = path.join(clientConfig.output.path, filename);
    return JSON.parse(fs.readFileSync(pathToFile, 'utf-8'));
  }

  function updateTemplate() {
    template = fs.readFileSync(templatePath, 'utf-8');
    console.log('Template has been updated');
  }

  // 0. Watch template file
  updateTemplate();

  chokidar.watch(templatePath).on('change', () => {
    updateTemplate();
    update();
  });

  // 1. Watch client files
  clientConfig.entry = [
    clientConfig.entry,
    'webpack-hot-middleware/client'
  ];

  clientConfig.plugins.push(
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  );

  const webpackDevMiddlewareInstance = webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    stats: {
      colors: true,
      modules: false
    }
  });

  const webpackHotMiddlewareInstance = webpackHotMiddleware(clientCompiler);

  app.use(webpackDevMiddlewareInstance);
  app.use(webpackHotMiddlewareInstance);

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

  // 2. Watch server bundle
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

module.exports = setupDevServer;
