const config = require('../../config');
const router = require('express').Router();

const mongoose = require('mongoose');
const Job = require('../../models/job.js');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

module.exports = router;

router.param('id', (req, res, next, id) => {
  Job
    .find({ jobId: req.params.id })
    .then(job => {
      req.job = job;
      next();
    })
    .catch(err => {
      next(err);
    });
});

router.get('/:id', (req, res, next) => {
  let job = req.job;

  if (job.length !== 1) return next();
  res.render('job', job[0]);
});