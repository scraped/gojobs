const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

let schema = new Schema({
  jobId: { type: String, unique: true, required: true },
  jobCurrId: { type: String, required: true },

  job: { type: Schema.Types.Mixed, required: true },

  version: { type: Number, required: true },
  validated: { type: Boolean },
  uploaded: { type: Boolean },

  fetched: { type: Date, required: true }
});

schema.post('save', doc => {
  console.log(`JobRaw: ${doc.jobId} added`);
});

schema.post('findOneAndUpdate', doc => {
  console.log(`JobRaw: ${doc.jobId} updated`);
})

module.exports = mongoose.model('JobRaw', schema);
