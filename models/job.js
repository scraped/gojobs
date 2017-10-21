const config = require('../config');
const moment = require('moment');
const array = require('lodash/array');
const number = require('lodash/number');

const mongoose = require('../lib/db');
require('./user');
const Schema = mongoose.Schema;

let jobSchema = new Schema({
  jobId: { type: String, required: true, unique: true },
  jobCurrId: { type: String, required: true },

  author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true, trim: true },
  desc: { type: String, required: true, trim: true },
  platform: { type: Number, set: setPlatform },
  img: { type: String, required: true, set: setImage },
  verif: { type: Number, required: true, default: '' },

  job: {
    mode: { type: Number, required: true, set: setMode, get: getMode },
    flags: { type: [String], get: getFlags },

    minpl: { type: Number, required: true, set: n => number.clamp(n, 1, 30) },
    maxpl: { type: Number, required: true, set: n => number.clamp(n, 1, 30) },

    race: {
      dist: { type: Number },
      laps: { type: Number, set: laps => number.clamp(laps, 1, 99) },
      checkp: { type: Number, set: num => number.clamp(num, 1, 68) },
    },
  },

  stats: {
    points: { type: Number, required: true },
    pldTot: { type: Number, required: true },
    pldUnq: { type: Number, required: true },
    quitTot: { type: Number, required: true },
    quitUnq: { type: Number, required: true },
    likes: { type: Number, required: true },
    dlikes: { type: Number, required: true },
    dlikesQuit: { type: Number, required: true },
    rating: { type: Number, required: true },
    ratingQuit: { type: Number, required: true },
  },

  updated: {
    ver: { type: Number, required: true },
    job: { type: Date, required: true },
    info: { type: Date, required: true }
  }
});

jobSchema.set('toObject', {
  virtual: true,
  versionKey: false,
  transform: (doc, ret) => {
    Reflect.deleteProperty(ret, "_id");
    ret.platform = config.platforms[ret.platform - 1].name;
    return ret;
  }
});

//
// Platform
//
function setPlatform(platform) {
  return 1 + array.findIndex(config.platforms, plat => plat.name === platform);
}

jobSchema.virtual('platformName').get(function() {
  return config.platforms[this.platform - 1].name;
});

//
// Image
//
function setImage(url) {
  let str = url.split('/');
  return `${str[5]}.${str[7]}`;
}

//
// Verification State
//
jobSchema.virtual('verifText').get(function() {
  return (this.verif === 'rstar') ? 'Rockstar Job' : 'Rockstar Verified Job'
});

function setMode(mode) {
  return array.findIndex(config.modes, m => m.name === mode);
}

function getMode(mode) {
  return config.modes[mode];
}

function getFlags(flags) {
  return flags.map(elem => config.flags[elem]);
}

jobSchema.virtual('ratingCssClass')
  .get(function() {
    let rating = this.stats.ratingQuit;
    return (rating >= 67) ? 'success' : (rating >= 34) ? 'warning' : 'danger';
  });

jobSchema.virtual('updatedDateString')
  .get(function() {
    let dateString = moment(this.updated.job).fromNow();
    if (this.category || this.updated.ver === 1) {
      return `Added ${dateString}`;
    } else {
      return `Updated ${dateString} (version ${this.updated.ver})`;
    }
  });

module.exports = mongoose.model('Job', jobSchema, 'jobs');
