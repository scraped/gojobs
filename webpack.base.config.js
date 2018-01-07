const config = require('./config');
const path = require('path');
const webpack = require('webpack');
const notifier = require('node-notifier');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const jsName = 'assets/js/[name].[chunkhash:6].js';
const jsChunkName = 'assets/js/dynamic/[id].[chunkhash:6].js';
const cssName = 'assets/css/[name].[contenthash:6].css';
const imagesName = 'assets/images/[name].[hash:6].[ext]';

const { production } = config;

// Why no clean-webpack-plugin? Two bundles need dist dir so no one
// can delete it. You must delete it manually before bunding
// (using rimraf, for example).

let webpackConfig = {
  output: {
    path: path.resolve(__dirname, config.distDir),
    publicPath: '/',
    filename: jsName,
    chunkFilename: jsChunkName
  },

  resolve: {
    alias: {
      '@components': path.resolve(config.srcDir, 'components'),
      '@views': path.resolve(config.srcDir, 'views')
    }
  },

  externals: {
    moment: 'moment'
  },

  module: {
    rules: [
      {
        test: /\.scss/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: { sourceMap: true }
          }, {
            loader: 'resolve-url-loader',
            options: { root: config.srcDir, sourceMap: true }
          }, {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }]
        })
      },

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

    new webpack.NoEmitOnErrorsPlugin(),

    new ExtractTextPlugin(cssName),
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

    new webpack.LoaderOptionsPlugin({ minimize: true }),

    new webpack.optimize.ModuleConcatenationPlugin(),
  );
}

module.exports = webpackConfig;
