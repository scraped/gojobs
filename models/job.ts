import {Schema, Document, Model, model} from 'mongoose';

import {platformsEnum} from '../config/static/platforms';
import {jobTypesEnum} from '../config/static/job-types';

const {
  jobTypes,
  vehicles,
  locations,
  vehClasses,
} = require('../config/static');

export enum JobVisibility {
  Public,
  Protected,
  Private,
}

export enum JobVerificationStatus {
  Ok,
  Pending,
  Refusal,
}

export interface IJobModel extends Document {
  jobId: string;
  jobCurrId: string;
  name: string;
  slug: string;
  author?: string;
  // rockstar?: boolean;
  desc: string;
  img: string;
  plat?: string;
  plrs?: Array<number>;
  teams?: number;
  ver: string;
  scType: string;
  scMode?: string;
  tags?: Array<string>;
  specific: {
    race?: {
      classes?: Array<number>;
      dist?: number;
      p2p?: boolean;
      defVeh?: number;
      chpLocs?: Array<Array<number>>;
      trfVeh?: Array<number>;
    }
  },
  stats: {
    trend: number;
    growth: number;
    coeffs: Array<number>;
    plTot: number;
    plUnq: number;
    like: number;
    dislike: number;
    quit: number;
    rating: number;
    rstRating: number;
  },
  meta: {
    verif: JobVerificationStatus;
    verifRefusalReason?: string;
    verifBy?: string;
    verifDate?: Date;
    visible: JobVisibility,
    scAdded?: Date;
    scAddedUnav?: boolean;
    scUpd: Date;
    fetchPrevent?: boolean;
    fetchFirst: Date;
    fetchLast: Date;
    fetchLastNewVer: Date;
    fetchNext: Date;
  },
}

function isRace() {
  return this.scType === 'race';
}

function nonRockstar() {
  return !this.rockstar;
}

const {validateFn} = require('../validators');

const jobIdValidator = validateFn('jobId');
const usernameValidator = validateFn('username');

const schema: Schema = new Schema({
  jobId: {
    type: String,
    validate: jobIdValidator,
    unique: true,
  },

  jobCurrId: {
    type: String,
    validate: jobIdValidator,
    required: true,
  },

  name: {
    type: String,
    trim: true,
    required: true,
  },

  slug: {
    type: String,
    required: true,
  },

  author: {
    type: String,
    validate: usernameValidator,
    required: nonRockstar,
  },

  desc: {
    type: String,
    trim: true,
    required: true,
  },

  // background: {
  //   type: [String],
  // },

  img: {
    type: String,
    set(imageUrl: string) {
      const str = imageUrl.split('/');
      return `${str[5]}.${str[7]}`;
    },
    required: true,
  },

  plat: {
    type: String,
    enum: platformsEnum,
    required: nonRockstar,
  },

  plrs: {
    type: [{
      type: Number,
      validate: Number.isInteger,
      min: 1,
      max: 30,
    }],
    validate(pl: Array<number>) {
      return pl.length === 2 && pl[0] <= pl[1];
    },
  },

  teams: {
    type: Number,
    validate: Number.isInteger,
    min: 2,
    max: 4,
  },

  ver: {
    type: Number,
    min: 1,
    validate: Number.isInteger,
    required: true,
  },

  scType: {
    type: String,
    enum: jobTypesEnum,
    required: true,
  },

  // Will be validated afterwards
  scMode: {
    type: String,
  },

  tags: {
    type: [String],
    // async validate(tags) {
    //   const allTags = await JobTag.find();

    //   return tags.every(tag => {
    //     return allTags.some(currTag => {
    //       const {mode, shortName} = currTag;
    //       return shortName === tag
    //         && (!mode || mode === this.scMode);
    //     });
    //   });
    // }
  },

  specific: {
    default: {},
    required: true,

    race: {
      classes: {
        type: [{
          type: String,
          enum: Object.keys(vehClasses),
        }],
        validate: isRace,
      },

      dist: {
        type: Number,
        min: 0,
        required: isRace,
      },

      p2p: {
        type: Boolean,
        validate: isRace,
      },

      defVeh: {
        type: String,
        enum: Object.keys(vehicles),
        validate: isRace,
      },

      chpLocs: {
        type: [[Number]],
        required: isRace,
      },

      trfVeh: {
        type: [{
          type: String,
          enum: Object.keys(vehicles),
        }],
        validate: isRace,
      },
    },
  },

  stats: {
    trend: {type: Number, min: 1, default: 1},
    growth: {type: Number, min: 1, default: 1},
    coeffs: {type: [Number]},

    plTot: {type: Number, min: 0, validate: Number.isInteger, required: true},
    plUnq: {type: Number, min: 0, validate: Number.isInteger, required: true},

    like: {type: Number, min: 0, validate: Number.isInteger, required: true},
    dislike: {type: Number, min: 0, validate: Number.isInteger, required: true},
    quit: {type: Number, min: 0, validate: Number.isInteger, required: true},

    rating: {type: Number, min: 0, max: 100, validate: Number.isInteger, required: true},
    rstRating: {type: Number, min: 0, max: 100, validate: Number.isInteger, required: true},
  },

  meta: {
    verif: {
      type: Number,
    },
    verifRefusalReason: {
      type: String,
    },
    verifBy: {
      type: String,
    },
    verifDate: {
      type: String,
    },
    visible: {
      type: Number,
    },
    scAdded: {
      type: Date,
    },
    scAddedUnav: {
      type: Boolean,
    },
    scUpd: {
      type: Date,
    },
    fetchPrevent: {
      type: Boolean,
    },
    fetchFirst: {
      type: Date,
    },
    fetchLast: {
      type: Date,
    },
    fetchLastNewVer: {
      type: Date,
    },
    fetchNext: {
      type: Date,
    },
  },

  scAdded: {
    type: Date,
  },

  scUpdated: {
    type: Date,
    required: true,
  },

  meta: {
    visible: {
      type: Boolean,
    },

    verified: {
      type: Boolean,
      default: false,
      required: true,
    },

    notVerifReason: {
      type: String,
      enum: [
        'badname',
        ''
      ],
      required() {
        return !this.verified;
      }
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
  },
},
{
  id: false,
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  toObject: {
    versionKey: false,
  },
});

schema.pre('save', function (next) {
  const {scType, scMode} = this;

  // Type validation
  const typeInfo = jobTypes[scType];

  if (!this.rockstar && typeInfo.rockstar) {
    throw new Error('This type is only available for rockstar jobs');
  }

  // Mode validation
  const possibleModes = typeInfo.modes;

  if (this.scMode) {
    if (!!this.scMode !== !!possibleModes) {
      throw new Error('This job type does not have any modes or vice versa');
    }

    if (!Object.keys(possibleModes).includes(scMode)) {
      throw new Error('Mode does not exist');
    }
  }

  next();
});

export const Job: Model<IJobModel> = model<IJobModel>('Job', schema);
