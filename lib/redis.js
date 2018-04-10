const redis = require('redis');
const bluebird = require('bluebird');

// It'll add a Async to all node_redis functions (e.g. client.getAsync())
bluebird.promisifyAll(redis.RedisClient.prototype);

let client = redis.createClient();

client.on('error', err => {
  console.log('Redis error occured:', err);
});

module.exports = client;
