const {mongoose} = require('../lib/db');
const {platforms, jobsTypes} = require('../config/static');
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

  featured: {
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
    validate(value) {
      return value >= 2 && value <= 4;
    }
  },

  platform: {
    type: Number,
    required: notRockstar,
    validate(plat) {
      return Object.keys(platforms).some(platName => platName === plat);
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
    type: Number,
    required: true,
    validate(type) {
      return Object.keys(jobsTypes).some(typeName => typeName === type);
    }
  },

  // Validated before saving
  scMode: {
    type: Number
  },

  tags: {
    type: [String]
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
    laps: {
      type: Number,
      validate(laps) {
        return laps >= 1 && laps <= 99;
      }
    },

    p2p: { type: Boolean },
    defVeh: { type: String },
    trfVeh: { type: [String] }
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
    virtuals: true,
    versionKey: false
  }
});

schema.virtual('imageUrl')
  .set(function(url) {
    const str = url.split('/');
    this.image = `${str[5]}.${str[7]}`;
  })
  // .get(function() {
  //   const img = this.image.split('.');
  //   const { jobCurrId } = this;
  //   return `https://prod.cloud.rockstargames.com/ugc/gta5mission/${img[0]}/${jobCurrId}/${img[1]}.jpg`;
  // });

schema.pre('save', function(next) {
  const {scType, scMode} = this;

  // Type validation
  const typeInfo = jobsTypes[scType];

  if (!!this.rockstar !== !!typeInfo.rockstar) {
    throw new Error('Non-rockstar jobs cannot be added with a type that only appers for rockstar jobs or vice versa');
  }

  // Mode validation
  const possibleModes = typeInfo.modes;

  if (!!this.scMode !== !!possibleModes) {
    throw new Error('This job type does not have any modes or vice versa');
  }

  if (!Object.keys(possibleModes).some(modeName => modeName === scMode)) {
    throw new Error('Mode does not exist');
  }

  // Tags validation

  next();
});


function notRockstar() {
  return !this.rockstar;
}

module.exports = mongoose.model('Job', schema);
