const {mongoose} = require('../lib/db');
const {platforms} = require('../config/static');

const {Schema} = mongoose;

let schema = new Schema({
  category: {
    type: String,
    enum: [
      'rockstar',
      'rockstarverified',
      'crew',
      'user'
    ],
    required: true
  },

  username: {
    type: String,
    required() {
      return this.category === 'user';
    }
  },

  crewId: {
    type: String,
    required() {
      return this.category === 'crew';
    }
  },

  platform: {
    type: String,
    enum: Object.keys(platforms),
    required() {
      const {category} = this;
      return category === 'user' || category === 'crew';
    }
  },

  count: {
    type: Number,
    default: -1,
    required: true
  },

  firstFetch: {
    type: Date
  },

  lastFetch: {
    type: Date
  },

  lastFetchMaxJobUpdateDate: {
    type: Date
  }
});

module.exports = mongoose.model('FetchStats', schema);
