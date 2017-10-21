const router = require('express').Router();
const object = require('lodash/object');

const Job = require('../../models/job');

module.exports = router;

router.get('/', (req, res, next) => {
  const perPage = 30;
  let page = Math.abs(Number(req.query.page)) || 1;

  Job.find({})
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ 'stats.points': -1 })
    .populate({ path: 'author', populate: { path: 'crew' } })
    .populate('crew')
    .then(jobs => {
      jobs = jobs.map(j => j.toObject());

      setTimeout(() => {
        res.send({
          jobs: jobs
        });
      }, 0);
    })
    .catch(err => {
      console.log(`Cannot retrieve jobs from the database: ${err.stack}`);
      next();
    });
});

// router.get('/:id', (req, res, next) => {
//   Job.findOne()
//     .exec()
//     .then(res.send)
//     .catch(err => {
//       console.log(`Cannot show job: ${err.message}`);
//       next();
//     });
// });
