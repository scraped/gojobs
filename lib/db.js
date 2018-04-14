const config = require('../config');
const mongoose = require('mongoose');
const chalk = require('chalk');

mongoose.Promise = global.Promise;

function connect() {
  mongoose.connect(config.mongo.connectUri, err => {
    if (err) {
      console.log(chalk.red(`Connection to the DB failed (retrying in 5 seconds): ${err.message}`));
      setTimeout(connect, 5000);
    }
  });
}

connect();

const db = mongoose.connection;

db.once('open', () => {
  console.log(chalk.green('Connection to the DB established'));
});

module.exports = mongoose;
