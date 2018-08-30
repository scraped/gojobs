const {mongoose} = require('../lib/db');
const {Schema} = mongoose;

let schema = new Schema({
  category: {
    type: String,
    enum: [
      'members',
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

  // crew: {
  //   type: Schema.Types.m
  // },

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
