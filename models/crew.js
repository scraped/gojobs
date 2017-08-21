const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let crewSchema = new Schema({
  id: Number,
  name: String,
  abbr: String,
  color: {
    type: String,
    default: '000000',
  }
});

module.exports = mongoose.model('crew', crewSchema);
