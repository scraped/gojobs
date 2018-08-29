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

  badName: {
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

  processDate: {
    type: Date,
    required() {
      return this.processed;
    }
  },

  uploaded: {
    type: Boolean,
    default: false
  },

  firstUploaded: {
    type: Date,
    required() {
      return this.uploaded;
    }
  },

  lastManualUpd: {
    type: Date
  },

  lastCoeffs: {
    type: [Number]
  }
});

module.exports = mongoose.model('RawJob', schema);
