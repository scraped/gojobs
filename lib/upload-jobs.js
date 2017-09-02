const config = require('../config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.connectUri, config.mongo.options);
const Job = require('../models/job');
const JobRaw = require('../models/job-raw');
const User = require('../models/user');
const Crew = require('../models/crew');

JobRaw.find((err, jobs) => {
    if (err) throw new Error('Cannot retrieve jobs');

    let i = 0;

    jobs.forEach(job => {
      let jobId = job.jobId;
      job = job.job.Content;

      // We don't need jobs played < 10 times or < 3 people
      // or that have 0 likes
      if (!job.stats
        || job.stats.pt < 10
        || job.stats.pu < 3
        || !job.ratings.rt_pos) return;

      const stats = {};
      stats.playTot = job.stats.pt;
      stats.playUnq = job.stats.pu;
      stats.quitUnq = job.stats.qu;
      stats.quitTot = job.stats.qt;
      stats.likes = job.ratings.rt_pos;
      stats.dlikesQuit = job.ratings.rt_neg;
      stats.dlikes = stats.dlikesQuit - job.stats.qu;
      stats.ratingQuit = Math.round(
        stats.likes / (stats.likes + stats.dlikesQuit) * 100
      );
      stats.rating = Math.round(
        stats.likes / (stats.likes + stats.dlikes) * 100
      );
      stats.bkmk = job.ratings.bkmk_unq;

      let mode = job.Metadata.data.mission.gen.mode;

      if (mode === 'Survival') {
        stats.ratingPoints = 0;
      } else {
        stats.ratingPoints = Math.ceil((stats.likes + stats.bkmk) / 50)
          + Math.ceil(
            ((stats.playTot / stats.playUnq + stats.playTot / stats.likes) * 10)
          )
          + Math.ceil(stats.rating / 10)
          + (100 - (stats.rating - stats.ratingQuit));
      }

      // 1. Saving a new job
      let newJob = new Job({
        jobId: jobId,

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
          console.log(`${jobId} - ${err.message}`);
        } else {
          // console.log(`Saved job ${jobId}`);
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
