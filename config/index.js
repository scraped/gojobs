module.exports = {
  port: 3000,
  srcDir: './src/',

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

  httpErrors: {
    e404: {
      code: 404,
      name: 'Not Found',
      cssClass: 'info',
      image: true,
    },
    e500: {
      code: 500,
      name: 'Internal Server Error',
      cssClass: 'warning',
      image: true,
    }
  },

  gamemodes: {
    1: {
      type: 'Race',
      submodes: {
        1: 'Special Vehicle Race',
        2: 'Stunt Race',
        3: 'Air Race',
        4: 'Bike Race',
        5: 'Land Race',
        6: 'Water Race',
      }
    }
  },

  submodes: {
    11: 'Special Vehicle Race',
    12: 'Stunt Race',
    13: 'Air Race',
    14: 'Bike Race',
    15: 'Land Race',
    16: 'Water Race',
    21: 'Versus Mission',
    22: 'Adversary Mode',
    31: 'Capture',
    41: 'Last Team Standing',
    51: 'Deathmatch',
    52: 'Team Deathmatch',
    53: 'Vehicle Deathmatch',
    61: 'Survival',
    71: 'Parachuting',
    0: 'Unknown',
  },

  _modes: {

  },

  platforms: {
    1: 'PC',
    2: 'PS4',
    3: 'Xbox One',
    4: 'PS3',
    5: 'Xbox 360',
  },
};
