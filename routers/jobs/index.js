const router = require('express').Router();
const mongoose = require('../../lib/db');
const uploadJobs = require('../../lib/upload-jobs');

const User = require('../../models/user');
const Job = require('../../models/job');

module.exports = router;

router.get('/', (req, res, next) => {
  const perPage = 30;
  const page = Math.abs(Number(req.query.page)) || 1;
  let count = 0;

  let searchOptions = {};

  let initialPromise = Promise.resolve();
  let author = req.query.author;
  // let crew = req.query.crew;

  if (author) {
    initialPromise = User.findOne({ username: author });
  }

  initialPromise
    .then(result => {
      if (result) {
        author = result._id;
        if (author) searchOptions.author = mongoose.Types.ObjectId(author);
      }

      return Job.count(searchOptions);
    })
    .then(amount => {
      count = amount;

      return Job.find(searchOptions)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ 'stats.points': -1 })
        .populate({
          path: 'author',
          populate: { path: 'crew' }
        })
        .populate('crew');
    })
    .then(jobs => {
      jobs = jobs
        .map(job => job.toObject());

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
