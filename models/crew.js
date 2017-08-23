const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function getColor(color) {
  return (color.length > 7) ? '000000' : color.split('#')[1];
}

function getTimestamp(date) {
  return date.getTime();
}

let crewSchema = new Schema({
  crewId: { type: Number, required: true, unique: true },
  // n:  { type: String, alias: 'name', required: true, trim: true },
  linkName: { type: String, required: true },
  abbr: { type: String, required: true, uppercase: true },
  color: { type: String, get: getColor, required: true },
  updated: { type: Date, default: Date.now(), required: true }
});

module.exports = mongoose.model('crew', crewSchema);
