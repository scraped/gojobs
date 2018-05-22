const sassLoadersProduction = [
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

const sassLoadersDevelopment = [
  {
    loader: 'vue-style-loader',
    options: { sourceMap: true }
  },

  ...sassLoadersProduction
];

module.exports = {
  sassLoadersProduction,
  sassLoadersDevelopment
};
