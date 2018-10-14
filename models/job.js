const {mongoose} = require('../lib/db');
const {
  platforms,
  jobTypes,
  vehicles,
  locations,
  vehClasses,
} = require('../config/static');

const {Schema} = mongoose;

function isRace() {
  return this.scType === 'race';
}

function nonRockstar() {
  return !this.rockstar;
}

let schema = new Schema(
  {
    jobId: {
      type: String,
      unique: true,
    },

    jobCurrId: {
      type: String,
      required: true,
    },

    rockstar: {
      type: Boolean,
      default: false,
      required: true,
    },

    star: {
      type: Boolean,
      default: false,
      required: true,
    },

    author: {
      type: String,
      required: nonRockstar,
    },

    name: {
      type: String,
      trim: true,
      required: true,
    },

    desc: {
      type: String,
      trim: true,
      required: true,
    },

    slug: {
      type: String,
      required: true,
    },

    background: {
      type: [String],
    },

    image: {
      type: String,
      set(imageUrl) {
        const str = imageUrl.split('/');
        return `${str[5]}.${str[7]}`;
      },
      required: true,
    },

    players: {
      type: [
        {
          type: Number,
          min: 1,
          max: 30,
        },
      ],
      validate(pl) {
        return pl.length === 2
          && pl[0] <= pl[1];
      },
    },

    teams: {
      type: Number,
      min: 2,
      max: 4,
    },

    plat: {
      type: String,
      enum: Object.keys(platforms),
      required: nonRockstar,
    },

    ver: {
      type: Number,
      min: 1,
      required: true,
      validate(value) {
        return Math.ceil(value) === value;
      },
    },

    scType: {
      type: String,
      enum: Object.keys(jobTypes),
      required: true,
    },

    scMode: {
      type: String,
    },

    tags: {
      type: [String],
      // async validate(tags) {
      //   const allTags = await JobTag.find();

      //   return tags.every(tag => {
      //     return allTags.some(currTag => {
      //       const {mode, shortName} = currTag;
      //       return shortName === tag
      //         && (!mode || mode === this.scMode);
      //     });
      //   });
      // }
    },

    locs: {
      type: [
        {
          type: String,
          lowercase: true,
        },
      ],
      validate(locs) {
        return locs.every(locName => Object.keys(locations)
          .some(currLocName => currLocName === locName.toLowerCase()));
      },
    },

    stats: {
      trend: {type: Number, default: 1},
      growth: {type: Number, default: 1},

      plTot: {type: Number, required: true},
      plUnq: {type: Number, required: true},

      like: {type: Number, required: true},
      dislike: {type: Number, required: true},
      quit: {type: Number, required: true},

      rating: {type: Number, required: true},
      rstRating: {type: Number, required: true},
    },

    specific: {
      default: {},
      required: true,

      type: {
        classes: [
          {
            type: String,
            enum: Object.keys(vehClasses),
          },
        ],

        laps: {
          type: Number,
          min: 1,
          max: 99,
        },

        dist: {
          type: Number,
          min: 0,
          required: isRace,
        },

        p2p: {
          type: Boolean,
        },

        defVeh: {
          type: String,
          enum: Object.keys(vehicles),
        },

        chpLocs: {
          type: [[Number]],
          required: isRace,
        },

        chpSecLocs: {
          type: [[Number]],
        },

        trfVeh: [
          {
            type: String,
            enum: Object.keys(vehicles),
          },
        ],
      },
    },

    scAdded: {
      type: Date,
    },

    scUpdated: {
      type: Date,
      required: true,
    },

    fetchDate: {
      type: Date,
      required: true,
    },
  },
  {
    id: false,
    toObject: {
      versionKey: false,
    },
  },
);

schema.pre('save', function (next) {
  const {scType, scMode} = this;

  // Type validation
  const typeInfo = jobTypes[scType];

  if (!this.rockstar && typeInfo.rockstar) {
    throw new Error('This type is only available for rockstar jobs');
  }

  // Mode validation
  const possibleModes = typeInfo.modes;

  if (this.scMode) {
    if (!!this.scMode !== !!possibleModes) {
      throw new Error('This job type does not have any modes or vice versa');
    }

    if (!Object.keys(possibleModes).includes(scMode)) {
      throw new Error('Mode does not exist');
    }
  }

  next();
});

module.exports = mongoose.model('Job', schema);
