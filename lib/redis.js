const redis = require('redis');
const bluebird = require('bluebird');

// https://www.npmjs.com/package/redis#promises
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let client = redis.createClient();

client.on('error', err => {
  console.log('Redis error occured:', err);
});

module.exports = client;
