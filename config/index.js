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

  modes: {
    1: {
      name: 'Adversary Mode',
      icon: 'advm'
    },

    2: {
      name: 'Versus Mission',
      icon: 'advm'
    },

    3: {
      name: 'Survival',
      icon: 'surv'
    },

    4: {
      name: 'Parachuting',
      icon: 'par'
    },

    5: {
      name: 'Capture',
      icon: 'cap'
    },

    6: {
      name: 'Last Team Standing',
      icon: 'lts'
    },

    7: {
      name: 'Deathmatch',
      icon: 'dm'
    },

    8: {
      name: 'Team Deathmatch',
      icon: 'tdm'
    },

    9: {
      name: 'Vehicle Deathmatch',
      icon: 'vdm'
    },

    10: {
      name: 'Land Race',
      icon: 'landrace'
    },

    11: {
      name: 'Bike Race',
      icon: 'bikerace'
    },

    12: {
      name: 'Air Race',
      icon: 'airrace'
    },

    13: {
      name: 'Water Race',
      icon: 'waterrace'
    },

    14: {
      name: 'Stunt Race',
      icon: 'stuntrace'
    },

    15: {
      name: 'Special Vehicle Race',
      icon: 'stuntrace'
    }
  },

  modesId: {
    'Adversary Mode': 1,
    'Versus Mission': 2,
    'Survival': 3,
    'Parachuting': 4,
    'Capture': 5,
    'Last Team Standing': 6,
    'Deathmatch': 7,
    'Team Deathmatch': 8,
    'Vehicle Deathmatch': 9,
    'Land Race': 10,
    'Bike Race': 11,
    'Air Race': 12,
    'Water Race': 13,
    'Stunt Race': 14,
    'Special Vehicle Race': 15
  },

  platforms: {
    1: 'PC',
    2: 'PS4',
    3: 'Xbox One',
    4: 'PS3',
    5: 'Xbox 360',
  },
};
