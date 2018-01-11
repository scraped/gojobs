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
// when something changes. Returns readyPromise
module.exports = function setupDevServer(app, updateCallback) {
  let resolveReadyPromise;
  let readyPromise = new Promise(r => {
    // link for resolving the promise
    resolveReadyPromise = r;
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

  //
  // 0. Watch template file
  //
  updateTemplate();

  chokidar.watch(templatePath).on('change', () => {
    updateTemplate();
    console.log('Template has been updated');
    update();
  });

  //
  // 1. Watch client files
  //
  clientConfig.entry.app = [
    'webpack-hot-middleware/client',
    clientConfig.entry.app,
  ];
  clientConfig.output.filename = 'assets/js/[name].js';
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );

  // clientConfig.plugins.push(
  //   new webpack.NamedModulesPlugin(),
  // );

  // console.log(clientConfig);

  const webpackDevMiddlewareInstance = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: false,
    stats: {
      colors: true,
      // modules: false
    }
  });

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

  app.use(require('webpack-hot-middleware')(clientCompiler, {
    heartbeat: 5000,
  }));

  //
  // 2. Watch server bundle
  //
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
