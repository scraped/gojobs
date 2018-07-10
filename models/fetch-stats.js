const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
  category: {
    type: String,
    enum: ['all', 'rockstar', 'rockstarverified']
  },

  username: {
    type: String
  },

  crewId: {
    type: String
  },

  platform: {
    type: String,
    enum: ['pc', 'ps4', 'xboxone'],
    required: isPlatformRequired
  },

  firstFetch: {
    type: Date,
    required: true
  },

  lastFetch: {
    type: Date,
    required: true
  },

  total: {
    type: Number,
    default: 0
  },

  skip: {
    type: Number,
    default: 0
  }
});

function isPlatformRequired() {
  const { category } = this;
  return category !== 'rockstar' && category !== 'rstarverified';
}

module.exports = mongoose.model('FetchStats', schema);
