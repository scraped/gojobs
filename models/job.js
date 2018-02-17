const _ = require('lodash');
const { platforms, modes } = require('../config/static');

const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

let schema = new Schema({
  jobId: { type: String, unique: true },
  jobCurrId: { type: String, required: true },

  rockstar: { type: Boolean },

  author: { type: String, required: notRockstar },
  name: { type: String, trim: true, required: true },
  slug: { type: String, required: true },
  image: { type: String, required: true },

  maxPl: { type: Number, set: setMaxPlayers, required: true },
  platform: { type: Number, required: notRockstar },
  scType: { type: Number, required: true },
  scMode: { type: Number },
  tags: { type: [String] },

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

schema.virtual('imageUrl')
  .set(function(url) {
    const str = url.split('/');
    this.imageId = `${str[5]}.${str[7]}`;
  })
  .get(function() {
    const img = this.imageId.split('.');
    const id = this.currId;
    return `https://prod.cloud.rockstargames.com/ugc/gta5mission/${img[0]}/${id}/${img[1]}.jpg`;
  });

schema.virtual('scTypeName')
  .set(function(typeName) {
    const typeId = 1 + _.findIndex(
      modes,
      type => type.name === typeName
    );
    this.scType = typeId;
  })
  .get(function() {
    return modes[this.scType - 1].name;
  });

schema.virtual('scModeName')
  .set(function(modeName) {
    const modeId = 1 + _.findIndex(
      modes[this.scType - 1].modes,
      mode => mode.name === modeName
    );
    if (modeId) {
      this.scMode = modeId;
    }
  })
  .get(function() {
    if (this.scMode) {
      return modes[this.scType - 1].modes[this.scMode - 1].name;
    }
  });

schema.virtual('platformName')
  .set(function(scPlatformName) {
    const platformId = 1 + _.findIndex(
      platforms,
      plat => plat.sc === scPlatformName
    );
    this.platform = platformId;
  })
  .get(function() {
    return platforms[this.platform - 1].name;
  });

function notRockstar() {
  return !this.rockstar;
}

function setMaxPlayers(n) {
  return _.clamp(n, 1, 30);
}

module.exports = mongoose.model('Job', schema);
