const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisClient = require('../lib/redis');

const SECRET = 'rggsgsehh5hhgerggeegdfssdbsdbsdbd';

module.exports = () => {
  return session({
    store: new RedisStore({ client: redisClient }),
    secret: SECRET,
    resave: false,
    // Forces a session that is "uninitialized" to be saved to the store
    saveUninitialized: false
  })
};
