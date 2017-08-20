const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('jobs-raw', jobRawSchema);

let jobRawSchema = new Schema({
  job:      Schema.Types.Mixed,
  updated:  Date,
});
