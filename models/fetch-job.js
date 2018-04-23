const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

let schema = new Schema({
  by: {
    type: String,
    enum: ['members', 'member', 'crew', 'job', 'rockstar', 'rstarverified'],
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

  jobIds: {
    type: [{
      id: {
        type: String,
        minlength: 22,
        maxlength: 22,
        required: true
      },

      processed: {
        type: Boolean,
        default: false
      }
    }]
  }
});

function isKeyRequired() {
  const { by } = this;
  return by === 'member' || by === 'crew' || by === 'job';
}

function isPlatformRequired() {
  const { by } = this;
  return by !== 'rockstar' && by !== 'rstarverified' && by !== 'job';
}

module.exports = mongoose.model('FetchJob', schema);
