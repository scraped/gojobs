const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function getColor(color) {
  return (color.length > 7) ? '000000' : color.split('#')[1];
}

function getTimestamp(date) {
  return date.getTime();
}

let crewSchema = new Schema({
  id: { type: Number, alias: 'crewId', required: true, unique: true },
  // n:  { type: String, alias: 'name', required: true, trim: true },
  ln: { type: String, alias: 'linkName', required: true },
  ab: { type: String, alias: 'abbr', required: true, uppercase: true },
  c:  { type: String, alias: 'color', get: getColor, required: true },
  u:  { type: Date, alias: 'updated', default: Date.now(), required: true }
});

module.exports = mongoose.model('crew', crewSchema);
