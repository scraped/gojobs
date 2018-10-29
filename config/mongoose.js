const mongoose = require('mongoose');
const chalk = require('chalk');
const config = require('.');

mongoose.Promise = global.Promise;

const {
  uri: connectUri,
  options: connectOptions,
} = config.mongo;

mongoose.connect(connectUri, connectOptions, error => {
  if (error) {
    console.log(chalk.red(
      `Connection to the mongodb failed: ${error.message}`,
    ));
  }
});

mongoose.set('useCreateIndex', true);

module.exports = {
  mongoose,
};
