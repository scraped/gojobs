const {env} = process;

let config = {
  port: env.PORT || 3000,
  kuePort: 4000,
  production: env.NODE_ENV === 'production',
  jwtSecret: 'rggsgsehh5hhgerggeegdfssdbsdbsdbd',

  mongo: {
    uri: env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goj-jobs',

    options: {
      useNewUrlParser: true,
      connectTimeoutMS: 2 ** 31 - 1,
      reconnectTries: Number.MAX_VALUE,
    }
  }
};

config.development = !config.production;

module.exports = config;
