const _ = require('lodash');
const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

function notRockstar() {
  return !this.rockstar;
}

function setMaxPlayers(n) {
  return _.clamp(n, 1, 30);
}

let schema = new Schema({
  jobId: { type: String },
  jobCurrId: { type: String, required: true },

  category: { type: String },

  author: { type: String, required: notRockstar },
  crew: { type: Schema.Types.ObjectId, ref: 'Crew' },

  name: { type: String, trim: true, required: true },
  slug: { type: String, required: true },
  imageId: { type: String, required: true },

  job: {
    maxpl: { type: Number, set: setMaxPlayers, required: true },
    platform: { type: Number, required: notRockstar },
    scType: { type: Number, required: true },
    scMode: { type: Number, required: true },
    type: { type: [String], required: true },
    tags: { type: [String], required: true }
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

module.exports = mongoose.model('Job', schema);
