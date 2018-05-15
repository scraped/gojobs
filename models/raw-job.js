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
      validator(job) {
        return Object.keys(job).length;
      },
      message: 'Job cannot be empty object'
    },
    required: true
  },

  extended: {
    type: Boolean,
    default: false
  },

  fetchDate: {
    type: Date,
    required: true
  },

  uploaded: {
    type: Boolean,
    default: false
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
