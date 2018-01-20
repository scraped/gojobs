exports.sassLoadersProduction = [
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
];

exports.sassLoadersDevelopment = [
  {
    loader: 'style-loader',
    options: { sourceMap: true }
  }
].concat(exports.sassLoadersProduction);
