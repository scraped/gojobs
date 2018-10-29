const redis = require('redis');
const bluebird = require('bluebird');

module.exports = {
  redisClient: null,

  createRedisClient() {
    // https://www.npmjs.com/package/redis#promises
    bluebird.promisifyAll(redis.RedisClient.prototype);
    bluebird.promisifyAll(redis.Multi.prototype);

    const client = redis.createClient();

    client.on('error', err => {
      console.log('Redis error occured:', err);
    });

    this.redisClient = client;
  },
};
