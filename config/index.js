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

  platforms: {
    1: 'PC',
    2: 'PS4',
    3: 'Xbox One',
    4: 'PS3',
    5: 'Xbox 360',
  },
};
