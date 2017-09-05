const config = require('../config');
const moment = require('moment');

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
  verif: { type: Number, set: setVerif },

  job: {
    flags: { type: [String] },
    // type: { type: Number, required: true, set: setType, get: setType },
    mode: { type: Number, required: true, set: setMode, get: getMode },
    minpl: { type: Number, required: true, set: setPlayers },
    maxpl: { type: Number, required: true, set: setPlayers },
  },

  stats: {
    ratingPoints: { type: Number, required: true },
    playTot: { type: Number, required: true, get: formatNumber },
    playUnq: { type: Number, required: true, get: formatNumber },
    quitTot: { type: Number, required: true },
    quitUnq: { type: Number, required: true },
    likes: { type: Number, required: true, get: formatNumber },
    dlikes: { type: Number, required: true, get: formatNumber },
    dlikesQuit: { type: Number, required: true, get: formatNumber },
    rating: { type: Number, required: true },
    ratingQuit: { type: Number, required: true },
    bkmk: { type: Number, required: true },
  },

  updated: {
    ver: { type: Number, required: true },
    job: { type: Date, required: true },
    info: { type: Date, required: true }
  }
});

function setPlayers(pl) {
  if (pl < 1) return 1;
  if (pl > 30) return 30;
  return pl;
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'm';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'k';
  return num;
}

function setPlat(platform) {
  return {
    'PC': 1,
    'Ps4': 2,
    'XBoxOne': 3,
    'Ps3': 4,
    'XBox': 5
  }[platform];
}

function getPlat(platform) {
  return config.platforms[platform];
}

function setImage(url) {
  let str = url.split('/');
  return `${str[5]}.${str[7]}`;
}

function setVerif(verifState) {
  return config.verif[verifState] || 0;
}

function setMode(mode) {
  return config.modesId[mode];
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
