const chalk = require('chalk');
const redis = require('redis');
const bluebird = require('bluebird');

// It'll add a Async to all node_redis functions (e.g. client.getAsync())
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let client = redis.createClient();

client.on('error', err => {
  console.log(chalk.red('Redis error occured:'), err);
});

module.exports = client;
