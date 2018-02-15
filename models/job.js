const _ = require('lodash');
const { categories, platforms, modes } = require('../config/static');

const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

let schema = new Schema({
  jobId: { type: String },
  jobCurrId: { type: String, required: true },

  category: { type: Number, set: setCategory, get: getCategory },

  author: { type: String, required: notRockstar },
  name: { type: String, trim: true, required: true },
  slug: { type: String, required: true },
  imageId: { type: String, required: true },

  job: {
    maxPl: { type: Number, set: setMaxPlayers, required: true },
    platform: { type: Number, set: setPlatform, get: getPlatform, required: notRockstar },
    scType: { type: Number, required: true },
    scMode: { type: Number },
    tags: { type: [String] }
  },

  stats: {
    points: { type: Number, required: true },
    playTot: { type: Number, required: true },
    playUnq: { type: Number, required: true },
    quitTot: { type: Number, required: true },
    quitUnq: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    dislikesQuit: { type: Number, required: true },
    rating: { type: Number, required: true },
    ratingQuit: { type: Number, required: true },
  },

  ver: { type: Number, required: true },

  scAdded: { type: Date },
  scUpdated: { type: Date, required: true }
}, {
  id: false,
  toObject: {
    versionKey: false,
    virtuals: true
  }
});

schema.virtual('image')
  .set(function(url) {
    const str = url.split('/');
    this.imageId = `${str[5]}.${str[7]}`;
  })
  .get(function() {
    const img = this.imageId.split('.');
    const id = this.currId;
    return `https://prod.cloud.rockstargames.com/ugc/gta5mission/${img[0]}/${id}/${img[1]}.jpg`;
  });

function notRockstar() {
  return !this.category;
}

function setMaxPlayers(n) {
  return _.clamp(n, 1, 30);
}

function setCategory(scCategoryName) {
  return 1 + _.findIndex(categories, cat => cat.sc === scCategoryName);
}

function getCategory(categoryId) {
  return categories[categoryId - 1].name;
}

function setPlatform(scPlatformName) {
  return 1 + _.findIndex(platforms, plat => plat.sc === scPlatformName);
}

function getPlatform(platformId) {
  return platforms[platformId - 1].name;
}

function setScType(normalizedTypeName) {
  return 1 + _.findIndex(modes, type => type.name === normalizedTypeName);
}

function getScType(typeId) {
  return modes[typeId - 1].name;
}

module.exports = mongoose.model('Job', schema);
