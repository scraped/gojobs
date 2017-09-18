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

  modes: [
    {
      name: 'Any',
      icon: ''
    },

    {
      name: 'Adversary Mode',
      icon: 'f11b'
    },

    {
      name: 'Versus Mission',
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

  platforms: [
    {
      name: 'Any'
    },

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

  tags: [
    {
      name: 'r_laps',
      desc: 'Lap race'
    },

    {
      name: 'r_p2p',
      desc: 'Point to point race'
    },

    {
      name: 'r_shared',
      desc: 'Shared sections',
    },

    {
      name: 'r_pitlane',
      desc: 'Pitlane',
    },
  ]
};
