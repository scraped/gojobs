const config = require('../config');
const path = require('path');
const webpack = require('webpack');
const notifier = require('node-notifier');

const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

// hash instead of chunkhash due to HMR
const jsName = 'assets/js/[name].[hash:6].js';
const jsChunkName = 'assets/js/dynamic/[id].[chunkhash:6].js';
const imagesName = 'assets/images/[name].[hash:6].[ext]';

const { production } = config;

// Why no clean-webpack-plugin? Two bundles need dist dir so no one
// can delete it. You must delete it manually before bunding
// (using rimraf, for example).

let webpackConfig = {
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: jsName,
    chunkFilename: jsChunkName
  },

  resolve: {
    alias: {
      'lib': path.resolve(__dirname, '../lib'),
      'src': path.resolve(__dirname, '../src'),
      'models': path.resolve(__dirname, '../models')
    }
  },

  externals: {
    moment: 'moment'
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
        }
      },

      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },

      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: production ? 4096 : 1,
          name: imagesName,
          fallback: 'file-loader'
        }
      }
    ]
  },

  plugins: [
    new FriendlyErrorsPlugin({
      onErrors (severity, errors) {
        if (severity !== 'error') return;
        errors.forEach(error => {
          notifier.notify({
            title: error.name,
            message: error.message,
            subtitle: error.file || ''
          });
        });
      }
    }),
  ],

  performance: {
    hints: production ? 'warning' : false
  }
};

if (production) {
  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),

    // https://webpack.js.org/plugins/module-concatenation-plugin/
    new webpack.optimize.ModuleConcatenationPlugin(),
  );
}

module.exports = webpackConfig;
