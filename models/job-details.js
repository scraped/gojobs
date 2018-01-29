const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

let schema = new Schema({
  job: { type: Schema.Types.ObjectId, ref: 'Job' },

  desc: { type: String, required: true, trim: true },

  specific: Schema.Types.Mixed
});

schema.set('id', false);

module.exports = mongoose.model('JobDetails', schema);
