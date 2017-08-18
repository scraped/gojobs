const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let jobRawSchema = new Schema({
  job: Schema.Types.Mixed
});

module.exports = mongoose.model('jobs-raw', jobRawSchema);
