const router = require('express').Router();
const mongoose = require('../../lib/db');
const uploadJobs = require('../../lib/upload-jobs');

const Job = require('../../models/job');

module.exports = router;

router.get('/', (req, res, next) => {
  const perPage = 30;
  const page = Math.abs(Number(req.query.page)) || 1;
  let count = 0;

  let searchOptions = {};
  let author = req.query.author;

  console.log(author);

  Job.count()
    .then(amount => {
      count = amount;
      return Job.find({})
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ 'stats.points': -1 })
        .populate({ path: 'author', populate: { path: 'crew' } })
        .populate('crew');
    })
    .then(jobs => {
      jobs = jobs.map(j => j.toObject());

      setTimeout(() => {
        res.json({
          count: count,
          jobs: jobs,
        });
      }, 2000);
    })
    .catch(err => {
      console.log(`Can't retrieve jobs from the database: ${err.stack}`);
      next();
    });
});

router.get('/id/:id', (req, res, next) => {
  let id = req.params.id;

  Job.findOne({ jobId: id })
    .then(job => {
      job = job.map(j => j.toObject());
      res.json(job);
    })
    .catch(err => {
      console.log(`Cant' show job: ${err.message}`);
      next();
    });
});

router.get('/upload', (req, res, next) => {
  res.send('Jobs is being uploaded');
  uploadJobs();
});
