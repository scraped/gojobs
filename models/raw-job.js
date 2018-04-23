const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

let schema = new Schema({
  jobId: {
    type: String,
    unique: true,
    required: true
  },

  jobCurrId: {
    type: String,
    required: true
  },

  job: {
    type: Schema.Types.Mixed,
    validate: {
      validator: function(job) {
        return Object.keys(job).length;
      },
      message: '"Job" should be rockstar job object'
    },
    required: true
  },

  delta: {
    type: Schema.Types.Mixed
  },

  fetchDate: {
    type: Date,
    required: true
  },

  uploaded: {
    type: Boolean,
    required: false
  },

  uploadDate: {
    type: Date,
    required: isUploaded
  }
});

function isUploaded() {
  return this.uploaded;
}

module.exports = mongoose.model('RawJob', schema);
