const config = require('../config');
const path = require('path');
const webpack = require('webpack');
const notifier = require('node-notifier');
require('babel-polyfill');

const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

// hash instead of chunkhash due to HMR
const jsName = 'assets/js/[name].[hash:6].js';
const jsChunkName = 'assets/js/[name].[chunkhash:6].js';
const imagesName = 'assets/images/[name].[hash:6].[ext]';

const { production } = config;

const mode = production ? 'production' : 'development';

// Why no clean-webpack-plugin? Two bundles utilize dist dir so no one
// can delete it. You should delete it manually before bunding (using rimraf,
// for example).
let webpackConfig = {
  mode,

  output: {
    filename: jsName,
    chunkFilename: jsChunkName,
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },

  resolve: {
    alias: {
      'src': path.resolve(__dirname, '../src')
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
          limit: 4096,
          name: imagesName,
          fallback: 'file-loader'
        }
      }
    ]
  },

  plugins: [
    new FriendlyErrorsPlugin({
      onErrors(severity, errors) {
        if (severity !== 'error') return;
        errors.forEach(error => {
          notifier.notify({
            title: error.name,
            message: error.message,
            subtitle: error.file || ''
          });
        });
      }
    })
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
    })
  );
}

module.exports = webpackConfig;
