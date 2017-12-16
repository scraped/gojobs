const config = require('../config');
const path = require('path');

exports.resolveSrc = file => {
  path.resolve(__dirname, config.srcDir, file);
};
