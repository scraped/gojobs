const config = require('../../config');
const router = require('express').Router();
const moment = require('moment');

const mongoose = require('mongoose');
const Job = require('../../models/job');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

module.exports = router;

router.use('/', (req, res, next) => {
  let pagenum = Math.abs(Number(req.query.page)) || 1;
  res.locals.partials = res.locals.partials || {};

  Job.find()
    .skip(18 * (pagenum - 1))
    .limit(18)
    .exec((err, jobs) => {
    if (err) return next('Cannot retrieve jobs from the database');

    jobs = jobs.map(job => {
      job.updated.dateString = moment(job.updated.job).fromNow();
      return job;
    });

    res.locals.partials.jobsContext = jobs;
    next();
  });
});

router.get('/', (req, res) => {
  res.render('index');
});
