const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

let schema = new Schema({
  jobId: { type: String, unique: true, required: true },
  jobCurrId: { type: String, required: true },

  job: { type: Schema.Types.Mixed, required: true },
  delta: { type: Schema.Types.Mixed },

  uploaded: { type: Boolean, required: true },

  fetchDate: { type: Date, required: true },
  uploadDate: { type: Date, required: isUploaded }
});

function isUploaded() {
  return this.uploaded;
}

module.exports = mongoose.model('RawJob', schema);
