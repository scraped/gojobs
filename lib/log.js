const timestamp = require('time-stamp');
const chalk = require('chalk');

console.log = console.log.bind(
  console,
  chalk.gray.bgWhiteBright(timestamp('HH:mm:ss'))
);