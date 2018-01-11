const config = require('./config');
const baseWebpackConfig = require('./webpack.base.config');
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const cssName = 'assets/css/[name].[contenthash:6].css';
const { production, development } = config;

const sassLoadersProduction = [{
  loader: 'css-loader',
  options: { sourceMap: true }
}, {
  loader: 'resolve-url-loader',
  options: { root: config.srcDir, sourceMap: true }
}, {
  loader: 'sass-loader',
  options: { sourceMap: true }
}];

const sassLoadersDevelopment = [{
  loader: 'style-loader',
  options: { sourceMap: true }
}].concat(sassLoadersProduction);

let webpackConfig = {
  entry: {
    app: path.resolve(config.srcDir, 'entry-client.js'),
    styles: path.resolve(config.srcDir, 'scss/main.scss')
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

    new VueSSRClientPlugin()
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
