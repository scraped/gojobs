const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

let schema = new Schema({
  jobId: { type: String, required: true, unique: true },
  jobCurrId: { type: String, required: true },

  job: { type: Schema.Types.Mixed, required: true },

  uploaded: { type: Boolean, required: true, default: false },

  dates: {
    fetch: { type: Date, required: true }
  }
});

module.exports = mongoose.model('JobRaw', schema);
