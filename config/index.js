const {env} = process;

const config = {
  port: env.PORT || 3000,
  production: env.NODE_ENV === 'production',
  development: !this.production,
  jwtSecret: env.JWT_SECRET || '',

  mongo: {
    uri: env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goj-jobs',

    options: {
      useNewUrlParser: true,
      connectTimeoutMS: 2 ** 31 - 1,
      reconnectTries: Number.MAX_VALUE,
    },
  },
};

module.exports = config;
