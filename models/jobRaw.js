const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let jobRawSchema = new Schema({
  job:      Schema.Types.Mixed,
  updated:  Date,
});

module.exports = mongoose.model('jobs-raw', jobRawSchema);
