const {mongoose} = require('../lib/db');
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
    required: true
  },

  blocked: {
    type: Boolean
  },

  extended: {
    type: Boolean,
    default: false
  },

  firstFetchDate: {
    type: Date,
    required: true
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

  firstUploadDate: {
    type: Date
  },

  lastCoeffs: {
    type: [Number]
  }
});

function isProcessed() {
  return this.processed;
}

function isFetchDateRequired() {
  return this.extended;
}

module.exports = mongoose.model('RawJob', schema);
