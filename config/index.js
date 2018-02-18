let config = {
  port: process.env.PORT || 3000,
  production: process.env.NODE_ENV === 'production',

  mongo: {
    connectUri: 'mongodb://andrew:qwerty@ds157521.mlab.com:57521/goj-jobs',

    options: {
      useMongoClient: true,
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

config.url = `http://localhost:${config.port}`;
config.development = !config.production;

module.exports = config;
