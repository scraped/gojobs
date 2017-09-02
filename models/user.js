const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  userId: { type: Number, required: true, unique: true },
  nickname: { type: String, required: true },
  crew: { type: Number },
  updated: { type: Date, default: Date.now(), required: true },
});

userSchema.virtual('avatarSmallUrl')
  .get(function() {
    return `https://a.rsg.sc/n/${this.nickname.toLowerCase()}/s`;
  });

userSchema.virtual('avatarLargeUrl')
  .get(function() {
    return `https://a.rsg.sc/n/${this.nickname.toLowerCase()}/l`;
  });

module.exports = mongoose.model('User', userSchema, 'users');
