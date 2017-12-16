module.exports = {
  port: process.env.PORT || 3000,
  isProduction: process.env.NODE_ENV === 'production',
  srcDir: './src',
  distDir: './dist',

  mongo: {
    connectUri: 'mongodb://andrew:qwerty@ds157521.mlab.com:57521/goj-jobs',

    options: {
      useMongoClient: true,
      keepAlive: true,
    },

    standardUpdateOptions: {
      upsert: true,
      setDefaultsOnInsert: true,
      runSettersOnQuery: true
    },
  }
};
