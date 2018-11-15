const redis = require('redis');
const bluebird = require('bluebird');
const {redisUri} = require('./');

// https://www.npmjs.com/package/redis#promises
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient(redisUri);

client.on('error', err => {
  console.log('Redis error occured:', err);
});

client.on('ready', () => {
  console.log('Redis is ready');
});

exports.redisClient = client;
