const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function setColor(color) {
  return (color.length > 6) ? '000000' : color;
}

let crewSchema = new Schema({
  crewId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  tag: { type: String, required: true, uppercase: true },
  color: { type: String, required: true, set: setColor },
  avatar: { type: Number, required: true },
  uploadedLast: { type: Date },
  updated: { type: Date, default: Date.now(), required: true },
});

crewSchema.virtual('avatarUrl')
  .get(function() {
    return `https://prod.cloud.rockstargames.com/crews/sc/${this.avatar}/${this.crewId}/publish/emblem/emblem_128.png`;
  });

module.exports = mongoose.model('Crew', crewSchema, 'crews');
