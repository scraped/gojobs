const config    = require('../config');
const express   = require('express');
const router    = express.Router();
const moment    = require('moment');
const mongoose  = require('mongoose');
const JobModel  = require('../models/job.js');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

router.use((req, res, next) => {
  if (!res.locals.partials) res.locals.partials = {};

  JobModel.find((err, jobs) => {
    if (err) console.error(err);

    jobs = jobs.map(job => {
      job.info.submodeName    = job.getSubmodeName();
      job.platformName        = job.getPlatformName();
      job.ratings.ratingColor = job.getRatingColor();
      job.updated.dateString  = moment(job.updated.date).fromNow();

      if (!job.tags) job.tags = {};
      if (job.category == 1) job.tags.verified = true;
      if (job.category == 2) job.tags.rockstar = true;
      return job;
    });

    res.locals.partials.jobsContext = jobs;
    next();
  });
});

router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;
