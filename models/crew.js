const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

function notRockstar() {
  return !this.rockstar;
}

function setColor(color) {
  return color.substr(0, 6).toLowerCase();
}

let schema = new Schema({
  _id: { type: Number },

  rockstar: { type: Boolean },
  leader: { type: Schema.Types.ObjectId, ref: 'User', required: notRockstar },

  name: { type: String, trim: true, required: true },
  slug: { type: String, unique: true, required: true },
  desc: { type: String, trim: true, required: notRockstar },
  motto: { type: String, trim: true, required: notRockstar },

  tag: { type: String, uppercase: true, required: true },
  color: { type: String, set: setColor, required: notRockstar },
  avatarId: { type: String, required: notRockstar },

  jobs: {
    fetched: { type: Number, default: 0, required: true },
    total: { type: Number, default: 0, required: true }
  },

  lastFetch: { type: Date },
  lastUpload: { type: Date }
}, {
  id: false,
  toObject: {
    virtual: true,
    versionKey: false
  }
});

schema.virtual('avatarUrl')
  .get(function() {
    const { avatar, crewId } = this;
    return `https://prod.cloud.rockstargames.com/crews/sc/${avatar}/${crewId}/publish/emblem/emblem_128.png`;
  });

module.exports = mongoose.model('Crew', schema);
