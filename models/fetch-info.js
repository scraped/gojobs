const {mongoose} = require('../lib/db');
const {platforms} = require('../config/static');

const {Schema} = mongoose;

function nonRockstar() {
  const {category} = this;
  return category !== 'rockstar';
}

const schema = new Schema(
  {
    type: {
      type: String,
      enum: [
        'rockstar',
        'crew',
        'user',
      ],
      required: true,
    },

    id: {
      type: String,
      validate: {
        validator(id) {
          const rockstarId = [
            'rockstar',
            'verified',
          ];
          return !(this.type === 'rockstar' && !rockstarId.includes(id));
        },
        msg: 'If type is "rockstar", id should be either "rockstar" or "verified"',
      },
      required: nonRockstar,
    },

    plat: {
      type: String,
      enum: Object.keys(platforms),
      required: nonRockstar,
    },

    total: {
      type: Number,
      default: -1,
      required: true,
    },

    offset: {
      type: Number,
      default: 0,
      required: true,
    },

    firstFetch: {
      type: Date,
    },

    lastFetch: {
      type: Date,
    },

    since: {
      type: Date,
    },

    // Needed for pretty complicated fetching manipulations
    futureSinceDate: {
      type: Date,
    },
  },
  {
    id: false,
  },
);

// Define unique compound index
schema.index(
  {
    type: 1,
    platform: 1,
    id: 1,
  },
  {unique: true},
);

module.exports = mongoose.model('FetchInfo', schema);
