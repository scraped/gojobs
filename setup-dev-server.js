const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const clientConfig = require('./webpack.client.config');
const serverConfig = require('./webpack.server.config');

module.exports = app => {
  // I. Setup client config
  clientConfig.entry = [
    clientConfig.entry,
    'webpack-hot-middleware/client'
  ];

  clientConfig.plugins.push(
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  );

  // II. Setup webpack DEV middleware
  const clientCompiler = webpack(clientConfig);
  const devMiddleware = webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath
  });

  app.use(devMiddleware);

  // III. Setup webpack HOT middleware
  app.use(webpackHotMiddleware(clientCompiler));

  // IV. Setup server config
  const serverCompiler = webpack(serverConfig);
};
