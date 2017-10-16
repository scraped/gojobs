const moment = require('moment');

const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

let crewSchema = new Schema({
  crewUrl: { type: String, required: true, unique: true },
  crewId: { type: Number },
  url: { type: String },

  name: { type: String, trim: true },
  tag: { type: String, required: true, uppercase: true },
  color: { type: String, required: true, set: color => color.substr(0, 6) },
  avatar: { type: String },

  jobsAmount: {
    total: { type: Number, required: true, default: 0 },
    fetched: { type: Number, required: true, default: 0 },
  },

  updated: { type: Date, required: true },
  uploadedLast: { type: Date },
});

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
