const baseWebpackConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
const webpack = require('webpack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const { production } = require('../config');

const {
  sassLoadersDevelopment,
  sassLoadersProduction
} = require('./sass-setup');

const entryApp = './src/entry-client.js',
  entryStyles = './src/scss/main.scss',
  cssName = 'assets/css/[name].[contenthash:6].css';

let webpackConfig = {
  entry: {
    app: entryApp,
    styles: entryStyles
  },

  optimization: {},

  devtool: production ? 'none' : '#cheap-inline-module-source-map',

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
    ]
  },

  plugins: [
    new VueSSRClientPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: production ? 'static' : 'server',
      openAnalyzer: false
    })
  ]
};

// PRODUCTION
if (production) {
  webpackConfig.plugins.push(
    new MiniCssExtractPlugin({
      filename: cssName
    })
  );

  webpackConfig.optimization.minimizer = [
    new OptimizeCSSAssetsPlugin()
  ]
// DEVELOPMENT
} else {
  webpackConfig.entry.app = [
    'webpack-hot-middleware/client?reload=true',
    webpackConfig.entry.app
  ];

  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoEmitOnErrorsPlugin()
  )
}

module.exports = merge(baseWebpackConfig, webpackConfig);
