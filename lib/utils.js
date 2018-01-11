const timestamp = require('time-stamp');
const chalk = require('chalk');

exports.formatInt = function(number) {
  number = Math.floor(Math.abs(Number(number)));
  return number;
};

exports.logMessage = function(message) {
  return chalk.gray(timestamp('HH:mm:ss')) + ' ' + message;
};
