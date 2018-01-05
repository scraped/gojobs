const config = require('./config');
const baseWebpackConfig = require('./webpack.base.config');
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const { production } = config;

const webpackConfig = {
  entry: path.resolve(config.srcDir, 'entry-client.js'),

  plugins: [
    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        // a module is extracted into the vendor chunk if...
        return (
          // it's inside node_modules
          /node_modules/.test(module.context)
          // and not a CSS file (due to extract-text-webpack-plugin limitation)
          && !(/\.css$/).test(module.request)
        )
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),

    new CleanWebpackPlugin(`${config.distDir}/assets`),

    new VueSSRClientPlugin()
  ]
};

if (production) {
  webpackConfig.plugins.push(
    new UglifyJSWebpackPlugin({
      sourceMap: true,
      uglifyOptions: {
        compress: {
          warnings: false
        }
      }
    }),
  );
}

module.exports = merge(baseWebpackConfig, webpackConfig)
