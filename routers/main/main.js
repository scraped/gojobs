const config = require('../../config');
const router = require('express').Router();
const Paginator = require('paginator');

const mongoose = require('mongoose');
const Job = require('../../models/job');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

module.exports = router;

router.use('/', (req, res, next) => {
  res.locals.partials = res.locals.partials || {};
  res.pageNumber = Math.abs(Number(req.query.page)) || 1;

  let findQuery = {};
  req.query.author && (findQuery.author = req.query.author);
  req.query.verif && (findQuery.verif = req.query.verif);
  req.query.plat && (findQuery.platId = req.query.plat);

  Job.find(findQuery)
    .skip(config.perPage * (res.pageNumber - 1))
    .limit(config.perPage)
    .sort({
      'stats.ratingPoints': -1
    })
    .exec((err, jobs) => {
      if (err) return next('Cannot retrieve jobs from the database');

      Job.find(findQuery).count((err, count) => {
        if (err) return next('Cannot retrieve jobs from the database');
        res.jobsCount = count;
        res.locals.partials.jobsContext = jobs;
        next();
      });
    });
});

router.get('/', (req, res) => {
  let pagination = new Paginator(config.perPage, 1).build(
    res.jobsCount, res.pageNumber
  );

  res.render('index', {
    query: req.query,
    pagination: pagination,

  });
});
