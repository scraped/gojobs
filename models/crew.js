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
  color: { type: String, set: setColor, required: true },
  avatar: { type: Number, required: true },
  updated: { type: Date, default: Date.now(), required: true },
  uploadedLast: { type: Date }
});

module.exports = mongoose.model('crew', crewSchema);
