const config = require('../config');
const mongoose = require('mongoose');
const chalk = require('chalk');

mongoose.Promise = global.Promise;

const {uri: connectUri, options: connectOptions} = config.mongo;

mongoose.connect(connectUri, connectOptions, error => {
  if (error) {
    console.log(chalk.red(
      `Connection to the mongodb failed: ${error.message}`
    ));
  }
});

module.exports = {
  mongoose
};
