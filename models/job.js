const config = require('../config');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let jobSchema = new Schema({
  jobId: { type: String, required: true, unique: true },

  name: { type: String, required: true, trim: true },
  desc: { type: String, required: true, trim: true },
  plat: { type: Number, required: true, min: 1, max: 5 },
  author: { type: String, required: true },
  img: { type: String, required: true },

  job: {
    type: { type: Number, required: true },
    mode: { type: Number, required: true },
    flags: { type: [String] },
    verified: { type: Number, required: true, default: 0 },
  },

  verif: {
    rstarJob: { type: Boolean },
    rstarVerif: { type: Boolean },
    ourVerif: { type: Boolean },
    ourRecom: { type: Boolean },
  },

  stats: {
    playTot: { type: Number, required: true },
    playUnq: { type: Number, required: true },
    quitTot: { type: Number, required: true },
    quitUnq: { type: Number, required: true },
    likes: { type: Number, required: true },
    dlikes: { type: Number, required: true },
    bkmk: { type: Number, required: true },
    rating: { type: Number, required: true },
    ratingReal: { type: Number, required: true }
  },

  updated: {
    ver: { type: Number, required: true },
    job: { type: Date, default: Date.now, required: true },
    info: { type: Date, default: Date.now, required: true }
  }
});

jobSchema.virtual('image')
  .set((url) => {
    let str = str.split('/');
    this.img = `${str[5]}.${str[7].split('_')[0]}`;
  })
  .get(() => {
    let info = this.img.split('.');
    return `https://prod.cloud.rockstargames.com/ugc/gta5mission/${info[0]}/${this.jobId}/${info[1]}_0.jpg`;
  });

jobSchema = new Schema({
  jobID: String,
  category: Number,
  name: String,
  desc: String,
  image: String,
  platform: Number,

  info: {
    mode: Number,
    submode: Number,
    minlvl: Number,
    minplayers: Number,
    maxplayers: Number,
  },

  details: Schema.Types.Mixed,

  creator: {
    nickname: String,
    medal: Number,
    crew: {
      tag: String,
      rank: Number,
      color: {
        type: String,
        default: '000000'
      }
    }
  },

  ratings: {
    playedTotal: Number,
    playedUnique: Number,
    quitTotal: Number,
    quitUnique: Number,
    likes: Number,
    dislikes: Number,
    rating: Number,
  },

  updated: {
    date: Date,
    version: Number
  },
});


jobSchema.virtual('submodeName').get(function () {
  return config.submodes[this.info.submode];
});

jobSchema.virtual('platformName').get(function () {
  return config.platforms[this.platform];
});

jobSchema.methods.getRatingColor = function () {
  let rating = this.ratings.rating;
  return (rating >= 67) ? 'success' : (rating >= 34) ? 'warning' : 'danger';
};

module.exports = mongoose.model('Job', jobSchema, 'jobs');
