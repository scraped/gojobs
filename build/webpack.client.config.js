const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.config');

const {production, development} = require('../config');

const jsLoaders = ['babel-loader'];

if (production) {
  jsLoaders.push({
    loader: 'eslint-loader',
    options: {failOnError: true},
  });
}

const webpackConfig = {
  // Why we don't use a separate entry for styles? They'll be extracted
  // from generated chunk and it will be empty
  entry: {
    app: ['./src/entry-client.js'],
    polyfill: '@babel/polyfill',
  },

  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin(),

      new UglifyjsWebpackPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: {
            warnings: false,
          },
        },
      }),
    ],

    splitChunks: {
      automaticNameDelimiter: '-',

      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: chunk => chunk.name !== 'polyfill',
        },
      },
    },
  },

  devtool: production ? 'none' : 'cheap-module-inline-source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders,
      },
    ],
  },

  plugins: [
    // https://github.com/webpack/webpack/issues/3128#issuecomment-311418452
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),

    new VueSSRClientPlugin(),

    new BundleAnalyzerPlugin({
      analyzerMode: production ? 'static' : 'server',
      openAnalyzer: false,
    }),
  ],
};

if (development) {
  webpackConfig.entry.app.push('webpack-hot-middleware/client?reload=true');

  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
  webpackConfig.plugins.push(
    new CleanWebpackPlugin('assets', {
      root: path.resolve(__dirname, '../dist'),
    }),
  );
}

module.exports = merge(baseWebpackConfig, webpackConfig);
