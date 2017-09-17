const config = require('../config');
const moment = require('moment');
const array = require('lodash/array');
const number = require('lodash/number');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let jobSchema = new Schema({
  jobId: { type: String, required: true, unique: true },
  jobCurrId: { type: String, required: true },

  name: { type: String, required: true, trim: true },
  desc: { type: String, required: true, trim: true },
  platform: { type: Number, required: true, set: setPlat, get: getPlat },
  author: { type: String },
  image: { type: String, required: true, set: setImage },
  categ: { type: String, enum: ['rstar', 'verif'] },

  job: {
    mode: { type: Number, required: true, set: setMode, get: getMode },
    minpl: { type: Number, required: true, set: n => number.clamp(n, 1, 30) },
    maxpl: { type: Number, required: true, set: n => number.clamp(n, 1, 30) },
    flags: { type: [String] },
  },

  stats: {
    points: { type: Number, required: true },
    pldTot: { type: Number, required: true, get: formatNumber },
    pldUnq: { type: Number, required: true, get: formatNumber },
    quitTot: { type: Number, required: true },
    quitUnq: { type: Number, required: true },
    likes: { type: Number, required: true, get: formatNumber },
    dlikes: { type: Number, required: true, get: formatNumber },
    dlikesQuit: { type: Number, required: true, get: formatNumber },
    rating: { type: Number, required: true },
    ratingQuit: { type: Number, required: true },
  },

  updated: {
    ver: { type: Number, required: true },
    job: { type: Date, required: true },
    info: { type: Date, required: true }
  }
});

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'm';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'k';
  return num;
}

function setPlat(platform) {
  return array.indexOf(config.platforms, platform);
}

function getPlat(platformId) {
  return config.platforms[platformId];
}

function setImage(url) {
  let str = url.split('/');
  return `${str[5]}.${str[7]}`;
}

function setVerif(verifState) {
  return config.verif[verifState] || 0;
}

function setMode(mode) {
  let modeId;

  config.modes.forEach((item, i) => {
    if (item.name === mode) modeId = i;
  });

  return modeId;
}

function getMode(mode) {
  return config.modes[mode];
}

jobSchema.virtual('verifText')
  .get(function() {
    return config.verif[this.verif];
  });

jobSchema.virtual('imageUrl')
  .get(function() {
    let info = this.image.split('.');
    return `https://prod.cloud.rockstargames.com/ugc/gta5mission/${info[0]}/${this.jobCurrId}/${info[1]}.jpg`;
  });

jobSchema.virtual('ratingCssClass')
  .get(function() {
    let rating = this.stats.ratingQuit;
    return (rating >= 67) ? 'success' : (rating >= 34) ? 'warning' : 'danger';
  });

jobSchema.virtual('updatedDateString')
  .get(function() {
    let dateString = moment(this.updated.job).fromNow();
    if (this.verif || this.updated.ver === 1) {
      return `Added ${dateString}`;
    } else {
      return `Updated ${dateString} (version ${this.updated.ver})`;
    }
  });

module.exports = mongoose.model('Job', jobSchema, 'jobs');
