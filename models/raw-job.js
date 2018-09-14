const {mongoose} = require('../lib/db');

const {Schema} = mongoose;

const schema = new Schema({
  jobId: {
    type: String,
    unique: true,
    required: true
  },

  jobCurrId: {
    type: String,
    required: true
  },

  star: {
    type: Boolean
  },

  blocked: {
    type: Boolean
  },

  job: {
    type: Schema.Types.Mixed,
    required: true
  },

  tags: {
    type: [String]
  },

  versions: [
    {
      v: Number,
      jobId: String,
      diff: Boolean,
      _id: false,
    }
  ],

  firstAddedToRgsc: {
    type: Date,
    required() {
      return !this.firstVerNotAvail;
    }
  },

  firstVerNotAvail: {
    type: Boolean
  },

  firstFetch: {
    type: Date,
    required: true
  },

  lastFetch: {
    type: Date,
    required: true
  },

  lastNewVerFetch: {
    type: Date,
    required: true
  },

  processed: {
    type: Boolean,
    default: false
  },

  uploaded: {
    type: Boolean,
    default: false
  },

  processDate: {
    type: Date,
    required() {
      return this.processed;
    }
  },

  firstUploaded: {
    type: Date,
    required() {
      return this.uploaded;
    }
  },

  lastManualUpdate: {
    type: Date
  },

  lastCoeffs: {
    type: [Number]
  }
});

module.exports = mongoose.model('RawJob', schema);
