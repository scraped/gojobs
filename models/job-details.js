const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

const schema = new Schema({
  jobId: { type: String, unique: true },

  desc: { type: String, trim: true, required: true },

  crew: { type: Schema.Types.ObjectId, ref: 'Crew' },

  background: [{
    type: String,
  }],

  foregroundLight: {
    type: Boolean,
  },

  specific: Schema.Types.Mixed
}, {
  id: false
});

module.exports = mongoose.model('JobDetails', schema);
