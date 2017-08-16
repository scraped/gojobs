const config = require('./config');
const express = require('express');
const moment = require('moment');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars').create({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    upperCase: str => str.toUpperCase(),
    lowerCase: str => str.toLowerCase(),
  },
});

mongoose.connect(config.mongo.connectUri, config.mongo.options);
const JobModel = require('./models/job.js');

const app = express();

app.engine('.hbs', handlebars.engine);
app.disable('x-powered-by');
app.set('view engine', '.hbs');
app.set('port', process.env.PORT || 3000);

function getJobs(req, res, next) {
  if (!res.locals.partials) res.locals.partials = {};

  JobModel.find((err, jobs) => {
    if (err) console.error(err);

    jobs = jobs.map(job => {
      job.info.submodeName = job.getSubmodeName();
      job.platformName = job.getPlatformName();
      job.ratings.ratingColor = job.getRatingColor();
      job.updated.dateString = moment(job.updated.date).fromNow();

      if (!job.tags) job.tags = {};
      if (job.category == 1) job.tags.verified = true;
      if (job.category == 2) job.tags.rockstar = true;
      return job;
    });

    res.locals.partials.jobsContext = jobs;
    next();
  });
}

function setLogo(req, res, next) {
  if (!res.locals.partials) res.locals.partials = {};
  res.locals.partials.menuContent = { specialLogo: "-white" };
  next();
}

// Main page

app.get('/', getJobs, (req, res) => {
  res.render('index');
});

// job page

app.get('/job/:id', setLogo, (req, res, next) => {
  JobModel.find({ jobID: req.params.id }, (err, job) => {
    if (err) console.error(err);

    if (job.length == 1) {
      res.render('job', job[0]);
    } else {
      next();
    }
  });
});

// Static files
app.use(express.static('public'));

// 404
app.use((req, res) => {
  res.status(404);
  res.render('404');
});

// 500
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500);
  res.render('500');
});

// LISTEN

app.listen(app.get('port'), () => {
  console.log('Server is running at http://localhost:' + app.get('port'));
});
