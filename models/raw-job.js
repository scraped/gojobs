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

  blocked: {
    type: Boolean
  },

  job: {
    type: Schema.Types.Mixed,
    required: true
  },

  firstAddedToRgsc: {
    type: Date
  },

  firstFetchDate: {
    type: Date,
    required: true
  },

  fetchDate: {
    type: Date,
    required: true
  },

  fetchNewVerDate: {
    type: Date,
    required: true
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

module.exports = mongoose.model('RawJob', schema);
