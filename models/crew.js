const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

function notRockstar() {
  return !this.rockstar;
}

function setColor(color) {
  return color.substr(0, 6).toLowerCase();
}

function getColor(color) {
  return '#' + color;
}

let schema = new Schema({
  crewId: { type: Number, unique: true, required: true },
  slug: { type: String, unique: true, required: true },

  rockstar: { type: Boolean },
  leader: { type: String, required: notRockstar },

  name: { type: String, trim: true, required: true },
  desc: { type: String, trim: true },
  motto: { type: String, trim: true, required: notRockstar },

  tag: { type: String, uppercase: true, required: true },
  color: { type: String, set: setColor, get: getColor, required: notRockstar },
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
    const { avatarId, crewId } = this;
    return `https://prod.cloud.rockstargames.com/crews/sc/${avatarId}/${crewId}/publish/emblem/emblem_128.png`;
  });

module.exports = mongoose.model('Crew', schema);
