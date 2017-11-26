const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

let crewSchema = new Schema({
  crewUrl: { type: String, required: true, unique: true },
  crewId: { type: Number },

  name: { type: String, trim: true },
  tag: { type: String, required: true, uppercase: true },
  color: { type: String, required: true, set: setColor, lowercase: true },
  avatar: { type: String },

  jobs: {
    fetched: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
  },

  dates: {
    updated: { type: Date, required: true },
    jobsUpload: { type: Date },
  }
});

function setColor(color) {
  return color.substr(0, 6);
}

crewSchema.set('toObject', {
  virtual: true,
  versionKey: false,
  transform: (doc, ret) => {
    Reflect.deleteProperty(ret, '_id');
    return ret;
  }
});

crewSchema.virtual('avatarUrl')
  .get(function() {
    return `https://prod.cloud.rockstargames.com/crews/sc/${this.avatar}/${this.crewId}/publish/emblem/emblem_128.png`;
  });

module.exports = mongoose.model('Crew', crewSchema, 'crews');
