module.exports = {
  port: process.env.PORT || 3000,
  srcDir: './src',
  distDir: './dist',

  perPage: 30,

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
  },

  platforms: [
    {
      name: 'PC',
    },

    {
      name: 'PS4',
    },

    {
      name: 'Xbox One',
    },
  ],

  medals: [
    {
      name: 'white'
    },

    {
      name: 'bronze'
    },

    {
      name: 'silver'
    },

    {
      name: 'gold'
    },

    {
      name: 'platinum'
    }
  ]
};
