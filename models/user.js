const config = require('../config');
const array = require('lodash/array');

const mongoose = require('mongoose');
require('./crew');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  username: { type: String, required: true, unique: true },

  crew: { type: Schema.Types.ObjectId, ref: 'Crew' },
  medal: { type: Number, set: setMedal },

  updated: { type: Date, required: true },
});

userSchema.set('toObject', {
  virtual: true,
  versionKey: false,
  transform: (doc, ret) => {
    Reflect.deleteProperty(ret, "_id");
    return ret;
  }
});

function setMedal(medal) {
  medal = medal || 'white';
  return 1 + array.findIndex(config.medals, med => med.name === medal);
}

userSchema.virtual('avatarSmallUrl')
  .get(function() {
    return `https://a.rsg.sc/n/${this.nickname.toLowerCase()}/s`;
  });

userSchema.virtual('avatarLargeUrl')
  .get(function() {
    return `https://a.rsg.sc/n/${this.nickname.toLowerCase()}/l`;
  });

module.exports = mongoose.model('User', userSchema, 'users');
