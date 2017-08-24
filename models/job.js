const config = require('../config');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let jobSchema = new Schema({
  jobID: { type: String, required: true, unique: true },
  flags: {
    rockstar: { type: Boolean },
    verified: { type: Boolean }
  },
  name: { type: String, required: true, trim: true },
  desc: { type: String, required: true, trim: true },
  images: {
    thumb: { type: String, required: true, trim: true },
    photos: { type: [String] }
  },
  platform: { type: Number, required: true },

  info: {
    mode: { type: Number, required: true },
    submode: { type: Number, required: true },
    minlvl: { type: Number, required: true },
    minplayers: { type: Number, required: true },
    maxplayers: { type: Number, required: true },
  },

  details: Schema.Types.Mixed,

  creator: {
    nickname: String,
    medal: { type: Number, required: true },
    crewId: { type: Number, required: true }
  },

  stats: {
    playedTot: { type: Number, required: true },
    playedUnq: { type: Number, required: true },
    quitTot: { type: Number, required: true },
    quitUnq: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    rating: { type: Number, required: true },
    ratingReal: { type: Number, required: true }
  },

  updated: {
    version: { type: Number, required: true },
    job: { type: Date, default: Date.now(), required: true },
    info: { type: Date, default: Date.now(), required: true }
  }
});

jobSchema.virtual('submodeName').get(function() {
  return config.submodes[this.info.submode];
});

jobSchema.virtual('platformName').get(function() {
  return config.platforms[this.platform];
});

jobSchema.methods.getRatingColor = function() {
  let rating = this.ratings.rating;
  return (rating >= 67) ? 'success' : (rating >= 34) ? 'warning' : 'danger';
};

module.exports = mongoose.model('job', jobSchema);
