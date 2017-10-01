const path = require('path');

module.exports = {
  entry: './src/js/main.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public/js')
  },

  watch: true
};
