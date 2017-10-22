const config = require('../config');
const modes = require('../config/modes');
const _ = require('lodash');

const mongoose = require('../lib/db');
require('./user');
const Schema = mongoose.Schema;

let jobSchema = new Schema({
  jobId: { type: String, required: true, unique: true },
  jobCurrId: { type: String, required: true },

  author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true, trim: true },
  desc: { type: String, required: true, trim: true },
  platform: { type: Number, get: getPlatform },
  image: { type: String, required: true, set: setImage },
  // verif: { type: Number, required: true, default: '' },

  job: {
    type: { type: Number, required: true, get: getType },
    mode: { type: Number, required: true },
    flags: { type: [String] },

    minpl: { type: Number, required: true, set: n => _.clamp(n, 1, 30) },
    maxpl: { type: Number, required: true, set: n => _.clamp(n, 1, 30) },

    race: {
      dist: { type: Number },
      laps: { type: Number, set: laps => _.clamp(laps, 1, 99) },
      checkp: { type: Number, set: num => _.clamp(num, 1, 68) },
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

function getPlatform(platformId) {
  return {
    id: platformId,
    name: config.platforms[platformId - 1].name
  };
}

function setImage(url) {
  const str = url.split('/');
  return `${str[5]}.${str[7]}`;
}

function getImage(job) {
  const img = job.image.split('.');
  const id = job.jobCurrId;
  return `https://prod.cloud.rockstargames.com/ugc/gta5mission/${img[0]}/${id}/${img[1]}.jpg`;
}

function getType(typeId) {
  return {
    id: typeId,
    name: modes[typeId - 1].name
  };
}

jobSchema.set('toObject', {
  getters: true,
  versionKey: false,
  transform: (doc, ret) => {
    Reflect.deleteProperty(ret, "_id");
    Reflect.deleteProperty(ret, "id");

    ret.image = getImage(ret);
    ret.job.mode = _.assign(
      modes[ret.job.type.id - 1].modes[ret.job.mode - 1],
      { id: ret.job.mode }
    );

    return ret;
  }
});

module.exports = mongoose.model('Job', jobSchema, 'jobs');
