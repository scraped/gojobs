const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

let schema = new Schema({
  crewId: { type: Number, required: true, unique: true },
  crewUrl: { type: String, required: true, unique: true },

  rockstar: { type: Boolean },

  name: { type: String, required: true, trim: true },
  desc: { type: String, required: true, trim: true },

  tag: { type: String, required: true, uppercase: true },
  color: { type: String, required: true, set: setColor, lowercase: true },
  avatar: { type: String },

  leader: { type: Schema.Types.ObjectId, ref: 'User' },

  jobs: {
    fetched: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
  },

  dates: {
    infoUpdate: { type: Date, required: true },
    fetch: { type: Date },
    upload: { type: Date }
  }
});

function setColor(color) {
  return color.substr(0, 6);
}

schema.set('toObject', {
  virtual: true,
  versionKey: false,
  // transform: (doc, ret) => {
  //   Reflect.deleteProperty(ret, '_id');
  //   return ret;
  // }
});

schema.set('id', false);

schema.virtual('avatarUrl')
  .get(function() {
    return `https://prod.cloud.rockstargames.com/crews/sc/${this.avatar}/${this.crewId}/publish/emblem/emblem_128.png`;
  });

module.exports = mongoose.model('Crew', schema);
