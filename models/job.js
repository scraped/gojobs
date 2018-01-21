const _ = require('lodash');

const mongoose = require('lib/db');
require('./user');
require('./crew');
const Schema = mongoose.Schema;

let jobSchema = new Schema({
  jobId: { type: String, required: true, unique: true },
  jobCurrId: { type: String, required: true },

  author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  crew: { type: Schema.Types.ObjectId, ref: 'Crew' },

  name: { type: String, required: true, trim: true },
  desc: { type: String, required: true, trim: true },
  image: { type: String, required: true, set: setImage },
  platform: { type: Number, required: true, enum: ['pc', 'xb1', 'ps4'] },

  starred: { type: Boolean },

  job: {
    specific: { type: Schema.Types.Mixed },
    maxpl: { type: Number, required: true, set: setMaxPlayers },
    gameType: { type: Number, required: true },
    gameMode: { type: Number, required: true },
    categories: { type: [Number] },
    feautures: { type: [Number] }
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
    add: { type: Date },
    update: { type: Date, required: true }
  }
});

function setImage(url) {
  const str = url.split('/');
  return `${str[5]}.${str[7]}`;
}

function getImage(job) {
  const img = job.image.split('.');
  const id = job.jobCurrId;
  return `https://prod.cloud.rockstargames.com/ugc/gta5mission/${img[0]}/${id}/${img[1]}.jpg`;
}

function setMaxPlayers(n) {
  return _.clamp(n, 1, 30);
}

jobSchema.set('toObject', {
  getters: true,
  versionKey: false,
  transform: (doc, ret) => {
    // Reflect.deleteProperty(ret, '_id');
    // Reflect.deleteProperty(ret, 'id');

    ret.image = getImage(ret);

    return ret;
  }
});

module.exports = mongoose.model('Job', jobSchema, 'jobs');
