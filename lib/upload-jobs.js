const config = require('../config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.connectUri, config.mongo.options);
const Job = require('../models/job');
const JobRaw = require('../models/job-raw');
const JobDetail = require('../models/job-detail');

JobRaw.find()
  // .limit(500)
  .exec((err, jobs) => {
    if (err) throw new Error('Cannot retrieve jobs');

    let i = 0;

    jobs.forEach(job => {
      let jobId = job.jobId;
      job = job.job.Content;

      // We don't need jobs played < 10 times
      if (job.stats.pt < 10 || (i++ % 50) != 0) return;

      JobRaw.update({ jobId: jobId }, { uploaded: true })
        .exec((err, res) => {
          if (err) throw new Error(`Couldn't mark ${jobId} as uploaded.`)
        });

      let likes = job.ratings.rt_pos;
      let dlikes = job.ratings.rt_neg;
      let rating = Math.round(
        likes / (likes + dlikes) * 100
      );
      let realRating = Math.round(
        likes / (likes + dlikes - job.stats.qu) * 100
      );

      let newJob = new Job({
        jobId: jobId,

        name: job.Metadata.name,
        desc: job.Metadata.desc,
        platform: job.Metadata.plat,
        author: job.Metadata.nickname,
        imageUrl: job.Metadata.thumbnail,
        mode: job.Metadata.data.mission.gen.mode,

        stats: {
          playTot: (job.stats) ? job.stats.pt : 0,
          playUnq: (job.stats) ? job.stats.pu : 0,
          quitUnq: (job.stats) ? job.stats.qu : 0,
          quitTot: (job.stats) ? job.stats.qt : 0,
          likes: likes,
          dlikes: dlikes,
          bkmk: job.ratings.bkmk_unq,
          rating: rating,
          ratingReal: realRating
        },

        updated: {
          ver: job.Metadata.ver,
          job: job.Metadata.cdate,
          info: new Date()
        }
      });

      let category = job.Metadata.cat;
      if (category === 'rstar') newJob.verif.rstarJob = true;
      if (category === 'verif') newJob.verif.rstarVerif = true;

      newJob.save(err => {
        if (err) {
          console.log(`[upload-jobs] ${err.message}`);
        } else {
          console.log(`[upload-jobs] Saved job ${jobId}`);
        }
      });
    });
  });
