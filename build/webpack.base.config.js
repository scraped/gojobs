const config = require('../config');
const path = require('path');
const webpack = require('webpack');
const notifier = require('node-notifier');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const {production} = config;

// hash instead of chunkhash due to HMR
const jsName = 'assets/js/[name].[hash].js';
const jsChunkName = 'assets/js/[name].[chunkhash].js';
const imagesName = 'assets/images/[name].[hash:6].[ext]';
const cssName = 'assets/css/[name].[contenthash].css';

// Few notes:
// 1. Why no clean-webpack-plugin? Two bundles utilize dist dir so no one
// can delete it. You should delete it manually before bundling
// (using rimraf, for example).
// 2. Why do we use scss loader in the base config? Vue-loader utilizes it!
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
        test: /\.scss$/,
        use: [
          production
            ? MiniCssExtractPlugin.loader
            : {
                loader: 'vue-style-loader',
                options: { sourceMap: true }
              },

          {
            loader: 'css-loader',
            options: { sourceMap: true }
          },

          {
            loader: 'resolve-url-loader',
            options: { sourceMap: true }
          },

          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      },

      // This loader uses file-loader as fallback
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 2 ** 11,
          name: imagesName
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
      : false,

    maxEntrypointSize: Infinity,
    maxAssetSize: 500 * 1000
  }
};

if (production) {
  webpackConfig.plugins.push(
    new MiniCssExtractPlugin({
      filename: cssName
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  );
}

module.exports = webpackConfig;
