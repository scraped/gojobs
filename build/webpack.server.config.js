const baseWebpackConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const webpackNodeExternals = require('webpack-node-externals');

const webpackConfig = {
  entry: './src/entry-server.js',

  output: {
    libraryTarget: 'commonjs2'
  },

  module: {
    rules: [
      {
        test: /\.scss/,
        use: 'null-loader'
      },
    ]
  },

  target: 'node',

  devtool: 'none',

  externals: webpackNodeExternals(),

  plugins: [
    new VueSSRServerPlugin()
  ]
};

module.exports = merge(baseWebpackConfig, webpackConfig);