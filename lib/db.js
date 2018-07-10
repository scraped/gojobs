const config = require('../config');
const mongoose = require('mongoose');
const chalk = require('chalk');

module.exports = {
  connectDb
};

function connectDb(successCallback) {
  mongoose.Promise = global.Promise;

  const uri = config.mongo.connectUri;

  console.log(chalk.yellow(`Connecting to the ${uri}...`));

  mongoose.connect(uri, error => {
    if (!error) {
      return;
    }
    console.log(chalk.red(`Connection to the ${uri} failed: ${error.message}. Trying to reconnect in 5 seconds...`));
    setTimeout(connectDb.bind(this, successCallback), 5000);
  });

  mongoose.connection.once('open', () => {
    console.log(chalk.green(`Connection to the ${uri} has been established`));
    successCallback();
  });
}
