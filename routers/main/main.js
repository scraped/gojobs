const config = require('../../config');
const router = require('express').Router();
const Paginator = require('paginator');
const paginate = require('../../lib/paginate');

const mongoose = require('mongoose');
const Job = require('../../models/job');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

module.exports = router;

router.use('/', (req, res, next) => {
  res.locals.partials = res.locals.partials || {};
  res.pageNumber = Math.abs(Number(req.query.page)) || 1;

  let findQuery = {};
  findQuery.category = req.query.category || '';
  req.query.author && (findQuery.author = req.query.author);
  req.query.platform && (findQuery.platform = req.query.platform);
  req.query.mode && (findQuery['job.mode'] = req.query.mode);

  Job.find(findQuery)
    .skip(config.perPage * (res.pageNumber - 1))
    .limit(config.perPage)
    .sort({ 'stats.points': -1 })
    .then(jobs => {
      Job.find(findQuery)
        .count((err, count) => {
          if (err) throw new Error(`Cannot retrieve jobs from the database`);
          res.jobsCount = count;
          res.locals.partials.jobsContext = jobs;
          next();
      });
    })
    .catch(err => {
      next(`${err.stack} Cannot retrieve jobs from the database`);
    });
});

router.get('/', (req, res) => {
  let pagination = new Paginator(config.perPage, 1).build(
    res.jobsCount, res.pageNumber
  );
  pagination.pages = paginate(pagination.total_pages, pagination.current_page);

  let context = {
    query: req.query,
    pagination: pagination,
    modes: config.modes,
  };
  if (config.modes[Number(req.query.mode)]) {
    context.modes[Number(req.query.mode)].isSet = true;
  }

  if (req.xhr) {
    context.layout = null;
    context.xhr = true;
  }

  res.render('index', context);
});
