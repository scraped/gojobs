const baseWebpackConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
const webpack = require('webpack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const { production, development } = require('../config');

const cssName = 'assets/css/[name].[contenthash:6].css';

const {
  sassLoadersDevelopment,
  sassLoadersProduction
} = require('./sass-setup');

let webpackConfig = {
  entry: {
    app: './src/entry-client.js',
    styles: './src/scss/main.scss'
  },

  devtool: production ? 'none' : '#cheap-inline-module-source-map',

  module: {
    rules: [
      {
        test: /\.scss/,
        use:
        production
        ?
          ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: sassLoadersProduction
          })
        :
          sassLoadersDevelopment
      },
    ]
  },

  plugins: [
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

    new VueSSRClientPlugin(),

    new BundleAnalyzerPlugin()
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

    new ExtractTextPlugin(cssName)
  );
}

if (development) {
  webpackConfig.entry.app = [
    'webpack-hot-middleware/client?reload=true',
    webpackConfig.entry.app
  ];

  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin()
  )
}

module.exports = merge(baseWebpackConfig, webpackConfig);
