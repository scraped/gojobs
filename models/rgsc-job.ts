import {Schema, Document, Model, model} from 'mongoose';

const {platforms} = require('../config/static');

const {validateFn} = require('../validators');

export interface IRgscJobModel extends Document {
  jobId: string;
  jobCurrId: string;
  job: object;
  processed: boolean;
  processDate: Date;
}

const jobIdValidator = validateFn('jobId');

const schema: Schema = new Schema({
  jobId: {
    type: String,
    validate: jobIdValidator,
    unique: true,
    required: true,
  },

  jobCurrId: {
    type: String,
    validate: jobIdValidator,
    unique: true,
    required: true,
  },

  job: {
    type: Object,
    required: true,
  },

  ver: {
    type: Number,
    required: true,
  },

  fetchFirst: {
    type: Date,
    required: true,
  },

  fetchLast: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: [
      'not_processed',
      'need_update_stats',
      'processed',
    ],
  },

  processDate: {
    type: Date,
    required() {
      return this.processed === 'processed';
    },
  },

  //
  //
  //

  fetchFirst: {
    type: Date,
    required: true,
  },

  fetchLast: {
    type: Date,
    required: true,
  },

  fetchLastNewVer: {
    type: Date,
    required: true,
  },

  nextFetch: {
    type: Date,
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
}, {
  id: false,
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  toObject: {
    versionKey: false,
  },
});

export const RgscJob: Model<IRgscJobModel> = model<IRgscJobModel>(
  'RgscJob',
  schema,
);
