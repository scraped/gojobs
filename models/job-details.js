const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

const schema = new Schema({
  job: { type: Schema.Types.ObjectId, ref: 'Job' },
  desc: { type: String, trim: true, required: true },
  specific: Schema.Types.Mixed
}, {
  id: false
});

module.exports = mongoose.model('JobDetails', schema);
