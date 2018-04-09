const baseWebpackConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
const webpack = require('webpack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

const { production } = require('../config');

const {
  sassLoadersDevelopment,
  sassLoadersProduction
} = require('./sass-setup');

const entryApp = './src/entry-client.js',
  cssName = 'assets/css/[name].[contenthash:6].css';

let webpackConfig = {
  // Why we don't use a separate entry for styles? They'll be extracted
  // from generated chunk and it will be empty
  entry: {
    app: entryApp,
    polyfill: 'babel-polyfill'
  },

  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin(),

      new UglifyjsWebpackPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: {
            warnings: false
          }
        }
      })
    ],

    splitChunks: {
      automaticNameDelimiter: '-',

      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },

  devtool: production ? 'none' : 'cheap-module-inline-source-map',

  module: {
    rules: [
      {
        test: /\.scss/,
        use:
          production
          ?
            [
              MiniCssExtractPlugin.loader,
              ...sassLoadersProduction
            ]
          :
            sassLoadersDevelopment
      },

      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    new VueSSRClientPlugin()
  ]
};

// PRODUCTION
if (production) {
  // We use it only in production because this plugin doesn't support HMR
  webpackConfig.plugins.push(
    new MiniCssExtractPlugin({
      filename: cssName
    })
  );
// DEVELOPMENT
} else {
  webpackConfig.entry.app = [
    'webpack-hot-middleware/client?reload=true',
    webpackConfig.entry.app
  ];

  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
}

webpackConfig.plugins.push(
  new BundleAnalyzerPlugin({
    analyzerMode: production ? 'static' : 'server',
    openAnalyzer: false
  })
);

module.exports = merge(baseWebpackConfig, webpackConfig);
