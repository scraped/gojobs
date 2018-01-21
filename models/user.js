const mongoose = require('../lib/db');
require('./crew');
const Schema = mongoose.Schema;

let schema = new Schema({
  username: { type: String, required: true, unique: true },

  crew: { type: Schema.Types.ObjectId, ref: 'Crew' },

  dates: {
    updated: { type: Date, required: true }
  }
});

schema.set('toObject', {
  getters: true,
  versionKey: false,
  transform: (doc, ret) => {
    Reflect.deleteProperty(ret, '_id');
    return ret;
  }
});

schema.virtual('avatar')
  .get(function() {
    const username = this.username.toLowerCase();
    return {
      small: `https://a.rsg.sc/n/${username}/s`,
      large: `https://a.rsg.sc/n/${username}/l`
    }
  });

module.exports = mongoose.model('User', schema);
