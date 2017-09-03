const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let jobRawSchema = new Schema({
  jobId: { type: String, required: true, unique: true },
  jobCurrId: { type: String, required: true },
  job: { type: Schema.Types.Mixed, required: true },
  updated: { type: Date, default: Date.now(), required: true },
  uploaded: { type: Boolean, default: false }
});

module.exports = mongoose.model('JobRaw', jobRawSchema, 'jobs-raw');
