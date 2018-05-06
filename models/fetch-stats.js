const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

let schema = new Schema({
  category: {
    type: String,
    enum: ['user', 'crew', 'rockstar', 'rockstarverified']
  },

  obj: {
    type: Schema.Types.ObjectId
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

function isPlatformRequired() {
  const { by } = this;
  return by !== 'rockstar' && by !== 'rstarverified';
}

module.exports = mongoose.model('FetchStats', schema);
