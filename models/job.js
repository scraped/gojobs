const {mongoose} = require('../lib/db');
const {platforms, jobTypes, vehicles} = require('../config/static');
const {JobTag} = require('./');
require('./job-details');

const {Schema} = mongoose;

let schema = new Schema({
  jobId: {
    type: String,
    unique: true
  },

  jobCurrId: {
    type: String,
    required: true
  },

  rockstar: {
    type: Boolean
  },

  star: {
    type: Boolean
  },

  author: {
    type: String,
    required: notRockstar
  },

  name: {
    type: String,
    trim: true,
    required: true
  },

  desc: {
    type: String,
    trim: true,
    required: true
  },

  slug: {
    type: String,
    required: true
  },

  background: {
    type: [String]
  },

  image: {
    type: String,
    set(imageUrl) {
      const str = imageUrl.split('/');
      return `${str[5]}.${str[7]}`;
    },
    required: true
  },

  players: {
    type: [{
      type: Number,
      min: 1,
      max: 30
    }],
    validate(pl) {
      return (pl.length === 1)
        || (pl.length === 2 && pl[0] <= pl[1]);
    }
  },

  teams: {
    type: Number,
    min: 2,
    max: 4
  },

  platform: {
    type: String,
    required: notRockstar,
    validate(plat) {
      return Object.keys(platforms).includes(plat);
    }
  },

  ver: {
    type: Number,
    min: 1,
    required: true,
    validate(value) {
      return Math.ceil(value) === value;
    }
  },

  scType: {
    type: String,
    required: true,
    validate(type) {
      return Object.keys(jobTypes).includes(type);
    }
  },

  // Validated before saving
  scMode: {
    type: String
  },

  tags: {
    type: [String],
    validate(tags) {
      return JobTag.find()
        .then(allTags => {
          return tags.every(tag => {
            return allTags.some(currTag => {
              const {mode, shortName} = currTag;
              return shortName === tag
                && (!mode || mode === this.scMode);
            });
          });
        })
        .catch(err => {
          throw err;
        });
    }
  },

  stats: {
    trend: { type: Number, default: 1 },
    growth: { type: Number, default: 1 },

    plTot: { type: Number, required: true },
    plUnq: { type: Number, required: true },

    like: { type: Number, required: true },
    dislike: { type: Number, required: true },
    quit: { type: Number, required: true },

    rating: { type: Number, required: true },
    rstRating: { type: Number, required: true },
  },

  specific: {
    default: {},

    laps: {
      type: Number,
      min: 1,
      max: 99,
      required: isRace
    },

    dist: {
      type: Number,
      required: isRace
    },

    p2p: {
      type: Boolean,
      required: isRace
    },

    defVeh: {
      type: String,
      validate(vehId) {
        return Object.keys(vehicles).includes(vehId);
      },
      required: isRace
    },

    trfVeh: {
      type: [String],
      validate(vehIds) {
        return vehIds.every(vehId => Object.keys(vehicles).includes(vehId))
      },
      required: isRace
    }
  },

  scAdded: {
    type: Date
  },

  scUpdated: {
    type: Date,
    required: true
  },

  fetchDate: {
    type: Date,
    required: true
  }
}, {
  id: false,
  toObject: {
    versionKey: false
  }
});

// schema.virtual('imageUrl')
  // .get(function() {
  //   const img = this.image.split('.');
  //   const { jobCurrId } = this;
  //   return `https://prod.cloud.rockstargames.com/ugc/gta5mission/${img[0]}/${jobCurrId}/${img[1]}.jpg`;
  // });

schema.pre('save', function(next) {
  const {scType, scMode} = this;

  // Type validation
  const typeInfo = jobTypes[scType];

  if (!!this.rockstar !== !!typeInfo.rockstar) {
    throw new Error('Non-rockstar jobs cannot be added with a type that only appers for rockstar jobs or vice versa');
  }

  // Mode validation
  const possibleModes = typeInfo.modes;

  if (!!this.scMode !== !!possibleModes) {
    throw new Error('This job type does not have any modes or vice versa');
  }

  if (!Object.keys(possibleModes).includes(scMode)) {
    throw new Error('Mode does not exist');
  }

  next();
});

function isRace() {
  return this.scType === 'race';
}

function notRockstar() {
  return !this.rockstar;
}

module.exports = mongoose.model('Job', schema);
