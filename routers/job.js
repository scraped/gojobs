const config    = require('../config');
const express   = require('express');
const router    = express.Router();
const mongoose  = require('mongoose');
const JobModel  = require('../models/job.js');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

router.param('id', (req, res, next, id) => {
  JobModel.find({ jobID: req.params.id }, (err, job) => {
    if (err) next(err);
    req.job = job;
    next();
  });
});

router.get('/job/:id', (req, res, next) => {
  let job = req.job;

  if (job.length == 1) {
    res.render('job', job[0]);
  } else {
    next();
  }
});

module.exports = router;
