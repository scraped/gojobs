module.exports = {
  mongo: {
    connectUri: 'mongodb://andrew:qwerty@ds157521.mlab.com:57521/goj-jobs',
    options: {
      useMongoClient: true,
      keepAlive: true,
    }
  },

  handlebars: {
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
      lowerCase: str => str.toLowerCase(),
    }
  },
};
