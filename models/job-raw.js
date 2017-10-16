const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

let jobRawSchema = new Schema({
  jobId: { type: String, required: true, unique: true },
  jobCurrId: { type: String, required: true },

  job: { type: Schema.Types.Mixed, required: true },

  updated: { type: Date, default: Date.now(), required: true },
  uploaded: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('JobRaw', jobRawSchema, 'jobs-raw');
