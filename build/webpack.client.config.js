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
  entryStyles = './src/scss/main.scss',
  cssName = 'assets/css/[name].[contenthash:6].css';

let webpackConfig = {
  entry: {
    app: entryApp,
    styles: entryStyles
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
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          // name: "vendors",
          chunks: "all"
        }
      }
    }
  },

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
    new VueSSRClientPlugin()
  ]
};

const addPlugin = webpackConfig.plugins.push;

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
