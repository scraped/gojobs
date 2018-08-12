const { env } = process;

let config = {
  port: env.PORT || 3000,
  kuePort: 4000,
  production: env.NODE_ENV === 'production',
  jwtSecret: 'rggsgsehh5hhgerggeegdfssdbsdbsdbd',

  mongo: {
    uri: env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goj-jobs',

    options: {
      useNewUrlParser: true,
      bufferCommands: false
    },

    // standardUpdateOptions: {
    //   new: true,
    //   runSettersOnQuery: true,
    //   runValidators: true,
    //   setDefaultsOnInsert: true,
    //   upsert: true
    // },
  }
};

config.development = !config.production;

module.exports = config;
