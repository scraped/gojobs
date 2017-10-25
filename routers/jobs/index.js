const config = require('../../config');
const router = require('express').Router();
const mongoose = require('../../lib/db');
const uploadJobs = require('../../lib/upload-jobs');
const utils = require('../../lib/utils');

const User = require('../../models/user');
const Crew = require('../../models/crew');
const Job = require('../../models/job');

module.exports = router;

router.get('/', (req, res, next) => {
  let searchOptions = {};
  let count = 0;

  const perPage = utils.formatInt(req.query.perPage) || config.perPage;
  const page = utils.formatInt(req.query.page) || 1;

  const author = req.query.author;
  const crew = req.query.crew;
  const platform = utils.formatInt(req.query.platform) || 1;
  const type = utils.formatInt(req.query.type);
  const mode = utils.formatInt(req.query.mode);
  const maxpl = utils.formatInt(req.query.maxpl);

  searchOptions.platform = platform;
  if (type) searchOptions['job.type'] = type;
  if (mode) searchOptions['job.mode'] = mode;
  if (maxpl) searchOptions['job.maxpl'] = { $lte: maxpl };

  let initialPromise = Promise.resolve();

  if (author) {
    initialPromise = User.findOne({ username: author });
  } else if (crew) {
    initialPromise = Crew.findOne({ crewUrl: crew });
  }

  initialPromise
    .then(result => {
      if (result) {
        if (author) {
          searchOptions.author = mongoose.Types.ObjectId(result._id)
        } else {
          searchOptions.crew = mongoose.Types.ObjectId(result._id);
        }
      }

      return Job.count(searchOptions);
    })
    .then(number => {
      count = number;

      return Job.find(searchOptions)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ 'stats.points': -1 })
        .populate('author')
        .populate('crew');
    })
    .then(jobs => {
      jobs = jobs.map(job => job.toObject());

      setTimeout(() => {
        res.json({
          count: count,
          jobs: jobs,
        });
      }, 1500);
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
