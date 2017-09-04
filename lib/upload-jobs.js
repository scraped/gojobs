const config = require('../config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.connectUri, config.mongo.options);
const Job = require('../models/job');
const JobRaw = require('../models/job-raw');
const User = require('../models/user');
const Crew = require('../models/crew');

module.exports = uploadJobs;

// stats is job.Content actually
// Returns an object
function generateStats(job) {
  let name = job.Metadata.name;

  let playTot = job.stats.pt;
  let playUnq = job.stats.pu;
  let quitUnq = job.stats.qu;
  let quitTot = job.stats.qt;
  let likes = job.ratings.rt_pos;
  let dlikesQuit = job.ratings.rt_neg;
  let dlikes = dlikesQuit - quitUnq;
  let bkmk = job.ratings.bkmk_unq;

  if (playTot < 10 || playUnq < 3 || likes < 2) {
    return;
  }

  let ratingQuit = Math.round(likes / (likes + dlikesQuit) * 100);
  let rating = Math.round(likes / (likes + dlikes) * 100);

  let ratingPoints = (likes + bkmk)
    * Math.max(0.82, (1 - playUnq / playTot))
    * Math.max(0.82, (1 - likes / playTot))
    * (rating / 100)
    * (1 - (rating - ratingQuit) / 100);

  // 1. If the name starts with shit (or non-english letters), decrease rating
  // significantly
  if (name[0].match(/[^\w]/)) {
    ratingPoints *= 0.1;
  }

  // 2. The more CAPITALIZED LETTERS are in the name, the less rating is
  let capitalized = 0, words = 1;
  let nameLength = name.length;
  for (let i = 0; i < nameLength; i++) {
    if (name[i].match(/\w/i) && name[i] === name[i].toUpperCase()) {
      capitalized++;
    }
    if (name[i] === ' ') words++;
  }
  capitalized = Math.max(capitalized - words, 0);
  ratingPoints *= Math.max((1 - capitalized / nameLength), 0.5);

  // 3. If it is not a race, decrease rating
  if (job.Metadata.data.mission.gen.type !== 'Race') {
    ratingPoints *= 0.8;
  }

  ratingPoints = Math.ceil(ratingPoints * 100);

  if (ratingPoints < 50) return;
  ratingPoints -= 50;

  return {
    ratingPoints: ratingPoints,
    playTot: playTot,
    playUnq: playUnq,
    quitTot: quitTot,
    quitUnq: quitUnq,
    likes: likes,
    dlikes: dlikes,
    dlikesQuit: dlikesQuit,
    rating: rating,
    ratingQuit: ratingQuit,
    bkmk: bkmk,
  }
}

function uploadJobs() {
  JobRaw.find((err, jobs) => {
    if (err) throw new Error('Cannot retrieve jobs');

    jobs.forEach(job => {
      let jobId = job.jobId;
      let jobCurrId = job.jobCurrId;
      job = job.job.Content;

      let mode = job.Metadata.data.mission.gen.mode;

      if (!job.stats || mode === 'Survival') return;

      let stats = generateStats(job);

      // 1. Saving a new job
      let newJob = new Job({
        jobId: jobId,
        jobCurrId: jobCurrId,

        name: job.Metadata.name,
        desc: job.Metadata.desc,
        platform: job.Metadata.plat,
        author: job.Metadata.nickname,
        imageUrl: job.Metadata.thumbnail,
        mode: job.Metadata.data.mission.gen.mode,
        verification: job.Metadata.cat,

        job: {
          minpl: job.Metadata.data.mission.gen.min,
          maxpl: job.Metadata.data.mission.gen.num
        },

        stats: stats,

        updated: {
          ver: job.Metadata.ver,
          job: job.Metadata.cdate,
          info: new Date()
        }
      });

      newJob.save(err => {
        if (err) {
          console.log(`${jobId} ERROR!`);
        } else {
          console.log(`${jobId} Saved`);
        }
      });

      JobRaw.update({ jobId: jobId }, { uploaded: true })
        .exec((err, res) => {
          if (err) throw new Error(`Couldn't mark ${jobId} as uploaded`)
        });

      // 2. Saving a user

      // 3. Saving a crew info

    });
  });
};
