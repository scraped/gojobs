const moment = require('moment');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let crewSchema = new Schema({
  crewId: { type: Number, required: true, unique: true },

  name: { type: String, required: true },
  url: { type: String, required: true },
  tag: { type: String, required: true, uppercase: true },
  color: { type: String, required: true, set: setColor },
  avatar: { type: String, required: true },

  jobs: { type: Number },
  fetched: { type: Number },

  updated: { type: Date, required: true },
  uploadedLast: { type: Date },
});

function setColor(color) {
  return (color.length > 6) ? '000000' : color;
}

crewSchema.virtual('avatarUrl')
  .get(function() {
    return `https://prod.cloud.rockstargames.com/crews/sc/${this.avatar}/${this.crewId}/publish/emblem/emblem_128.png`;
  });

crewSchema.virtual('uploadedDateString')
  .get(function() {
    if (!this.uploadedLast) return;
    return moment(this.uploadedLast).fromNow();
  });

module.exports = mongoose.model('Crew', crewSchema, 'crews');
