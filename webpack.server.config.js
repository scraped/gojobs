const config = require('./config');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const webpackNodeExternals = require('webpack-node-externals');

module.exports = merge(baseWebpackConfig, {
  entry: path.resolve(config.srcDir, 'entry-server.js'),

  // Это сообщает, что в серверной сборке следует использовать экспорты в стиле Node
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },

  target: 'node',

  externals: webpackNodeExternals({
    whitelist: /\.scss$/
  }),

  plugins: [
    new VueSSRServerPlugin()
  ]
});
