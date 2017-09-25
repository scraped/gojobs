const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  crew: { type: Schema.Types.ObjectId, ref: 'Crew' },
  updated: { type: Date, required: true },
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
