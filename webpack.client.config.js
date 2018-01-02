const config = require('./config');
const baseWebpackConfig = require('./webpack.base.config');
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

module.exports = merge(baseWebpackConfig, {
  entry: path.resolve(config.srcDir, 'entry-client.js'),

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    new VueSSRClientPlugin()
  ]
});
