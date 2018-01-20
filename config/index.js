const path = require('path');

let config = {
  port: process.env.PORT || 3000,
  production: process.env.NODE_ENV === 'production',
  srcDir: path.resolve('../src'),
  distDir: path.resolve('../dist'),

  mongo: {
    connectUri: 'mongodb://andrew:qwerty@ds157521.mlab.com:57521/goj-jobs',

    options: {
      useMongoClient: true,
      keepAlive: true,
    },

    standardUpdateOptions: {
      upsert: true,
      setDefaultsOnInsert: true,
      runSettersOnQuery: true,
      new: true
    },
  }
};

config.url = `http://localhost:${config.port}`;
config.development = !config.production;

module.exports = config;
