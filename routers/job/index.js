const config = require('../../config');
const router = require('express').Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Job = require('../../models/job.js');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

module.exports = router;

router.get('/:id', (req, res, next) => {
  Job.findOne({ jodId: req.params.id })
    .exec()
    .then(job => {
      res.render('job', job);
    })
    .catch(err => {
      console.log(`Cannot show job: ${err.message}`);
      next();
    });
});
