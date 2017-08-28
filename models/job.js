const config = require('../config');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let jobSchema = new Schema({
  jobId: { type: String, required: true, unique: true },

  name: { type: String, required: true, trim: true },
  desc: { type: String, required: true, trim: true },
  platform: { type: Number, required: true },
  creator: { type: String, required: true },
  images: {
    rstar: { type: String, required: true },
    custom: { type: [String] }
  },

  job: {
    type: { type: Number, required: true },
    mode: { type: Number, required: true },
    minplayers: { type: Number, required: true },
    maxplayers: { type: Number, required: true },
  },

  flags: {
    isRstar: { type: Boolean },
    isRstarVerif: { type: Boolean },
    list: { type: Schema.Types.Mixed }
  },

  // type-specific information
  specific: {
    raceP2P: { type: Boolean },
    raceVehCl: { type: [Number] },
    raceDefVehicle: { type: Number },
    raceDistance: { type: Number },
    raceCheckp: { type: Number },
    raceLaps: { type: Number },
    captureType: { type: Number, default: 0 },
    teamsAmount: { type: Number }
  },

  stats: {
    rstar: {
      playedTot: { type: Number, required: true },
      playedUnq: { type: Number, required: true },
      quitTot: { type: Number, required: true },
      quitUnq: { type: Number, required: true },
      likes: { type: Number, required: true },
      dislikes: { type: Number, required: true },
      bkmk: { type: Number, required: true },
      rating: { type: Number, required: true },
      ratingReal: { type: Number, required: true }
    }
  },

  updated: {
    ver: { type: Number, required: true },
    job: { type: Date, default: Date.now(), required: true },
    info: { type: Date, default: Date.now(), required: true }
  }
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

module.exports = mongoose.model('job', jobSchema);
