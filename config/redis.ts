import redis, {RedisClient} from 'redis';
import bluebird from 'bluebird';
import config from './';

const {redisUri} = config;

// https://www.npmjs.com/package/redis#promises
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export const client: RedisClient = redis.createClient(redisUri);

client.on('error', (err: Error) => {
  console.log('Redis error occured:', err);
});

client.on('ready', () => {
  console.log('Redis is ready');
});
