const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

let schema = new Schema({
  username: { type: String, required: true, unique: true },
  crew: { type: Schema.Types.ObjectId, ref: 'Crew' },
  infoUpdated: { type: Date, required: true }
}, {
  id: false,
  toObject: {
    versionKey: false,
    virtuals: true
  }
});

schema.virtual('avatar')
  .get(function() {
    const username = this._id.toLowerCase();
    return {
      small: `https://a.rsg.sc/n/${username}/s`,
      large: `https://a.rsg.sc/n/${username}/l`
    }
  });

module.exports = mongoose.model('User', schema);
