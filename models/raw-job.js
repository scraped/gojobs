const mongoose = require('mongoose');
const {Schema} = mongoose;

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
    required: isFetchDateRequired
  },

  processed: {
    type: Boolean,
    default: false
  },

  processDate: {
    type: Date,
    required: isProcessed
  },

  uploaded: {
    type: Boolean,
    default: false
  },

  lastCoeffs: {
    type: [Number]
  },

  firstUploadDate: {
    type: Date
  }
});

function isProcessed() {
  return this.processed;
}

function isFetchDateRequired() {
  return this.extended;
}

module.exports = mongoose.model('RawJob', schema);
