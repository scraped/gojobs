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
  _id: { type: String },
  currId: { type: String, required: true },

  rockstar: { type: Boolean },
  author: { type: String, required: notRockstar },
  crew: { type: Schema.Types.ObjectId, ref: 'Crew' },

  name: { type: String, trim: true, required: true },
  slug: { type: String, required: true },
  imageId: { type: String, required: true },
  platform: { type: Number, enum: ['pc', 'xb1', 'ps4'], required: notRockstar },

  job: {
    maxpl: { type: Number, required: true, set: setMaxPlayers },
    gameType: { type: Number, required: true },
    gameMode: { type: Number, required: true }
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

  dates: {
    fetch: { type: Date, required: true },
    addSc: { type: Date },
    updateSc: { type: Date, required: true }
  }
}, {
  id: false,
  toObject: {
    virtuals: true,
    versionKey: false
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
