const config = require('../config');
const mongoose = require('mongoose');
const chalk = require('chalk');

module.exports = {
  connectDb
};

const MAX_SEC_TO_NEXT_RECONNECT = 2 ** 6;

function connectDb(successCallback, secToNextReconnect = 2) {
  mongoose.Promise = global.Promise;

  const {uri: connectUri, options: connectOptions} = config.mongo;

  console.log(chalk.yellow(`Connecting to the mongodb...`));

  mongoose.connect(connectUri, connectOptions)
    .then(() => {
      console.log(chalk.green(`Connection to the mongodb established`));
      successCallback();
    })
    .catch(error => {
      console.log(chalk.red(
        `Connection to the mongodb failed: ${error.message}. Trying to reconnect in ${secToNextReconnect} seconds...`
      ));

      const newSecToNextReconnect =
        secToNextReconnect >= MAX_SEC_TO_NEXT_RECONNECT
          ? MAX_SEC_TO_NEXT_RECONNECT
          : secToNextReconnect * 2;

      setTimeout(
        connectDb.bind(this, successCallback, newSecToNextReconnect),
        secToNextReconnect * 1000
      );
    });
}
