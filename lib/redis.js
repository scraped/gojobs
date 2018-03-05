const redis = require('redis');
const client = redis.createClient();

module.exports = client;

client.on('error', err => {
  console.log('Redis error occured:', err);
});
