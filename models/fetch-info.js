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
          const rockstarIds = [
            'rockstar',
            'verified',
          ];
          return !(this.type === 'rockstar' && !rockstarIds.includes(id));
        },
        msg: 'If "type" field is "rockstar", "id" field should be either "rockstar" or "verified"',
      },
      required: nonRockstar,
    },

    plat: {
      type: String,
      enum: Object.keys(platforms),
      required: nonRockstar,
    },

    fetches: {
      type: Number,
      min: 0,
      default: 0,
      required: true,
    },

    jobs: {
      type: Number,
      default: 0,
      required: true,
    },

    offset: {
      type: Number,
      default: 0,
      required() {
        return !this.fetchOnlyNew;
      },
    },

    firstFetch: {
      type: Date,
      required() {
        return this.fetches;
      },
    },

    lastFetch: {
      type: Date,
      required() {
        return this.firstFetch;
      },
    },

    fetchOnlyNew: {
      type: Boolean,
      default: false,
      required: true,
    },

    maxUpdateDate: {
      type: Date,
      default: new Date(0),
      required: true,
    },

    prevMaxUpdateDate: {
      type: Date,
      default: new Date(0),
      required: true,
    },
  },
  {
    id: false,
  },
);

schema.index(
  {
    type: 1,
    platform: 1,
    id: 1,
  },
  {unique: true},
);

module.exports = mongoose.model('FetchInfo', schema);
