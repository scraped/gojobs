const router = require('express').Router();

const Job = require('../../models/job');

module.exports = router;

router.get('/', (req, res, next) => {
  Job.find({})
    .skip(0)
    .limit(30)
    .sort({ 'stats.points': -1 })
    .populate({
      path: 'author',
      populate: { path: 'crew' }
    })
    .populate('crew')
    .then(jobs => {
      setTimeout(() => {
        res.send(jobs);
      }, 3000);
    })
    .catch(err => {
      console.log(`Cannot retrieve jobs from the database: ${err.stack}`);
      next();
    });
});

router.get('/:id', (req, res, next) => {
  Job.findOne({ jodId: 'azaza' })
    .exec()
    .then(res.send)
    .catch(err => {
      console.log(`Cannot show job: ${err.message}`);
      next();
    });
});
