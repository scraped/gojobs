const config = require('../config');
const path = require('path');
const webpack = require('webpack');
const notifier = require('node-notifier');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const {production} = config;

// hash instead of chunkhash due to HMR
const jsName = 'assets/js/[name].[hash].js';
const jsChunkName = 'assets/js/[name].[chunkhash].js';
const imagesName = 'assets/images/[name].[hash].[ext]';

// Why no clean-webpack-plugin? Two bundles utilize dist dir so no one
// can delete it. You should delete it manually before bundling
// (using rimraf, for example).
let webpackConfig = {
  mode: production
    ? 'production'
    : 'development',

  output: {
    filename: jsName,
    chunkFilename: jsChunkName,
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    hashDigestLength: 6
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },

      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 4096,
          name: imagesName,
          fallback: 'file-loader'
        }
      }
    ]
  },

  plugins: [
    // For SFC
    new VueLoaderPlugin(),

    new FriendlyErrorsPlugin({
      onErrors(severity) {
        if (severity !== 'error') return;
        notifier.notify({
          title: 'Error during the bundling occured'
        });
      }
    })
  ],

  performance: {
    hints: production
      ? 'warning'
      : false
  }
};

if (production) {
  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  );
}

module.exports = webpackConfig;
