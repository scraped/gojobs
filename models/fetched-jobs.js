const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

let schema = new Schema({
  by: {
    type: String,
    enum: ['members', 'member', 'crew', 'rockstar', 'rstarverified'],
    required: true
  },

  key: {
    type: String,
    required: isKeyRequired
  },

  platform: {
    type: String,
    enum: ['pc', 'ps4', 'xbox'],
    required: isPlatformRequired
  },

  period: {
    type: String,
    enum: ['today', 'last7', 'lastMonth']
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

function isKeyRequired() {
  const { by } = this;
  return by === 'member' || by === 'crew' || by === 'job';
}

function isPlatformRequired() {
  const { by } = this;
  return by !== 'rockstar' && by !== 'rstarverified';
}

module.exports = mongoose.model('FetchedJobs', schema);
