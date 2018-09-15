const merge = require('webpack-merge');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const webpackNodeExternals = require('webpack-node-externals');
const baseWebpackConfig = require('./webpack.base.config');

const webpackConfig = {
  entry: './src/entry-server.js',

  output: {
    libraryTarget: 'commonjs2',
  },

  target: 'node',

  externals: webpackNodeExternals(),

  plugins: [new VueSSRServerPlugin()],
};

module.exports = merge(baseWebpackConfig, webpackConfig);
