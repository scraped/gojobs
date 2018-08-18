let config = {
  port: process.env.PORT || 3000,
  kuePort: 4000,
  production: process.env.NODE_ENV === 'production',
  jwtSecret: 'rggsgsehh5hhgerggeegdfssdbsdbsdbd',



  mongo: {
    connectUri: 'mongodb://andrew:qwerty@ds157521.mlab.com:57521/goj-jobs',

    options: {
      keepAlive: true,
    },

    standardUpdateOptions: {
      new: true,
      runSettersOnQuery: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      upsert: true
    },
  }
};

config.development = !config.production;

module.exports = config;
