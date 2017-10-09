const config = require('./config');
const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const jsName = 'assets/js/build-[hash].js';
const cssName = 'assets/css/[name]-[contenthash].css';
const imagesName = 'assets/images/[name].[hash].[ext]';

module.exports = {
  entry: config.srcDir + 'main.js',

  output: {
    path: path.resolve(__dirname, config.distDir),
    publicPath: '/',
    filename: jsName
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        }
      },

      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },

      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          fallback: `file-loader?name=${imagesName}`
        }
      },

      {
        test: /\.scss/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader'
          }, {
            loader: 'resolve-url-loader',
            options: { root: path.resolve(__dirname, 'src'), sourceMap: true }
          }, {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }]
        })
      }
    ]
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin(cssName),
    new HtmlWebpackPlugin({
      template: config.srcDir + 'index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true
      }
    })
  ],

  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },

  devServer: {
    historyApiFallback: true,
    noInfo: true
  },

  performance: {
    hints: false
  },

  devtool: '#eval-source-map'
};

//
// Production section
//

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';

  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
}
