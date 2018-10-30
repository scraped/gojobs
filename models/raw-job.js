const {mongoose} = require('../config/mongoose');
const {platforms} = require('../config/static');

const {Schema} = mongoose;

const {validateFn} = require('../validators');

const jobIdValidator = validateFn('jobId');

const schema = new Schema({
  jobId: {
    type: String,
    validate: jobIdValidator,
    unique: true,
    required: true,
  },

  jobCurrId: {
    type: String,
    validate: jobIdValidator,
    required: true,
  },

  star: {
    type: Boolean,
  },

  blocked: {
    type: Boolean,
  },

  job: {
    type: Schema.Types.Mixed,
    required: true,
  },

  normPlat: {
    type: String,
    enum: Object.keys(platforms),
    required: true,
  },

  tags: {
    type: [String],
  },

  versions: {
    type: [{
      v: {
        type: Number,
        validate: Number.isInteger,
        min: 1,
        required: true,
      },
      jobId: {
        type: String,
        validate: jobIdValidator,
        required: true,
      },
      diff: {
        type: Boolean,
        required: true,
      },
      _id: false,
    }],
  },

  firstAddedToRgsc: {
    type: Date,
    required() {
      return !this.firstVerNotAvail;
    },
  },

  firstVerNotAvail: {
    type: Boolean,
  },

  firstFetch: {
    type: Date,
    required: true,
  },

  lastFetch: {
    type: Date,
    required: true,
  },

  lastNewVerFetch: {
    type: Date,
    required: true,
  },

  nextFetch: {
    type: Date,
    required: true,
  },

  deleted: {
    type: Boolean,
    default: false,
    required: true,
  },

  processed: {
    type: Boolean,
    default: false,
  },

  processDate: {
    type: Date,
    required() {
      return this.processed;
    },
  },

  uploaded: {
    type: Boolean,
    default: false,
  },

  firstUploaded: {
    type: Date,
    required() {
      return this.uploaded;
    },
  },

  lastManualUpdate: {
    type: Date,
  },

  lastCoeffs: {
    type: [Number],
  },
});

module.exports = mongoose.model('RawJob', schema);
