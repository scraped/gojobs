module.exports = {
  port: 3000,
  srcDir: './src/',
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

  verif: {
    'rstar': 1,
    'verif': 2,
    1: 'Rockstar Job',
    2: 'Rockstar Verified Job',
    3: 'Verified by our team'
  },

  modes: [
    {
      name: 'Adversary Mode/Versus Mission',
      icon: 'f11b'
    },

    {
      name: 'Parachuting',
      icon: 'f107'
    },

    {
      name: 'Capture',
      icon: 'f113'
    },

    {
      name: 'Last Team Standing',
      icon: 'f16a'
    },

    {
      name: 'Deathmatch',
      icon: 'f167'
    },

    {
      name: 'Team Deathmatch',
      icon: 'f197'
    },

    {
      name: 'Vehicle Deathmatch',
      icon: 'f1a1'
    },

     {
      name: 'Land Race',
      icon: 'f168'
    },

    {
      name: 'Bike Race',
      icon: 'f109'
    },

    {
      name: 'Air Race',
      icon: 'f102'
    },

    {
      name: 'Water Race',
      icon: 'f1a5'
    },

    {
      name: 'Stunt Race',
      icon: 'e600'
    },

    {
      name: 'Special Vehicle Race',
      icon: 'f123'
    }
  ],

  modesId: {
    'Adversary Mode': 1,
    'Versus Mission': 2,
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
