const {mongoose} = require('../lib/db');
const {platforms} = require('../config/static');

const {Schema} = mongoose;

function nonRockstar() {
  const {category} = this;
  return category !== 'rockstar' && category !== 'rockstarverified';
}

const schema = new Schema({
  type: {
    type: String,
    enum: ['rockstar',
      'rockstarverified',
      'crew',
      'user'],
    required: true,
  },

  id: {
    type: String,
    required: nonRockstar,
  },

  mainPlatform: {
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
});

schema.index(
  {
    type: 1,
    id: 1,
  },
  {unique: true},
);

module.exports = mongoose.model('FetchStats', schema);
