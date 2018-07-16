const baseWebpackConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
const webpack = require('webpack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

const {production, development} = require('../config');

const cssName = 'assets/css/[name].[contenthash].css';

let webpackConfig = {
  // Why we don't use a separate entry for styles? They'll be extracted
  // from generated chunk and it will be empty
  entry: {
    app: ['./src/entry-client.js'],
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
          chunks: chunk => chunk.name !== 'polyfill'
        }
      }
    }
  },

  devtool: production
    ? 'none'
    : 'cheap-module-inline-source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
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
    ]
  },

  plugins: [
    // https://github.com/webpack/webpack/issues/3128#issuecomment-311418452
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),

    new VueSSRClientPlugin(),

    new BundleAnalyzerPlugin({
      analyzerMode: production ? 'static' : 'server',
      openAnalyzer: false
    })
  ]
};

if (development) {
  webpackConfig.entry.app.push(
    'webpack-hot-middleware/client?reload=true'
  );

  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
} else {
  webpackConfig.plugins.push(
    new MiniCssExtractPlugin({
      filename: cssName
    }),
  );
}

module.exports = merge(baseWebpackConfig, webpackConfig);
