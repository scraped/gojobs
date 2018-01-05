const config = require('./config');
const path = require('path');
const webpack = require('webpack');
const notifier = require('node-notifier');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const jsName = 'assets/js/[name].[hash:6].js';
const cssName = 'assets/css/[name].[contenthash:6].css';
const imagesName = 'assets/images/[name].[hash:6].[ext]';

const { isProduction } = config;

let webpackConfig = {
  output: {
    path: path.resolve(__dirname, config.distDir),
    publicPath: '/assets',
    filename: jsName
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
          limit: isProduction ? 4096 : 1,
          name: imagesName,
          fallback: 'file-loader'
        }
      }
    ]
  },

  plugins: [
    new FriendlyErrorsWebpackPlugin({
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
    // new HtmlWebpackPlugin({
    //   template: `${config.srcDir}/index.html`,
    //   filename: 'index.html',
    //   minify: { collapseWhitespace: true }
    // }),
  ],

  devServer: {
    historyApiFallback: true,
    noInfo: true,
    quiet: true,
    compress: true,
    // enables HMR without page refresh as fallback in case of build failures
    hot: true,
    hotOnly: true,
    // opens the browser
    open: true,
    overlay: true,
    proxy: {
      '/': `http://localhost:${config.port}`
    }
  },

  performance: {
    hints: isProduction ? 'warning' : false
  },

  devtool: isProduction ? 'none' : '#cheap-inline-module-source-map'
};

if (isProduction) {
  // production only
  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.LoaderOptionsPlugin({ minimize: true }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  );
} else {
  // development only
  webpackConfig.plugins.push(
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  )
}

module.exports = webpackConfig;
