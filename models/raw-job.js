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

  versions: [
    {
      v: Number,
      id: String,
      chg: Boolean
    }
  ],

  firstAddedToRgsc: {
    type: Date,
    required: function() { return !this.firstVerNotAvail; }
  },

  firstVerNotAvail: {
    type: Boolean
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
    required: function() { return this.processed; }
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

module.exports = mongoose.model('RawJob', schema);
