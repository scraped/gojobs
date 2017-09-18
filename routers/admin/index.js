const config = require('../../config');
const router = require('express').Router();
const request = require('request-promise');
const fetchJobs = require('../../lib/fetch-jobs');
const uploadJobs = require('../../lib/upload-jobs');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const JobRaw = require('../../models/job-raw');
const Crew = require('../../models/crew');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

module.exports = router;

router.get('/', (req, res) => {
  Crew
    .find()
    .then(crews => {
      res.locals.partials.crewsContext = crews;
      res.render('admin');
    })
    .catch(err => {
      return next('Cannot fetch data from database');
    });
});

router.get('/uploadraw', (req, res, next) => {
  uploadJobs()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      return next(err);
    });
});

router.get('/fetch', (req, res, next) => {
  req.query = req.query || {};

  let params = {};
  params.by = req.query.type;
  params.id = req.query.id;
  params.platform = req.query.platform;
  params.period = req.query.period;
  params.once = Boolean(req.query.once);
  params.limit = Number(req.query.limit);

  let isCrew = (params.by === 'crew');
  let updatedCrewInfo = false;
  let i = 0;

  function recordJobs(jobs) {
    let jobsAmount = jobs.Count;

    jobs.Missions.forEach(job => {
      let jobId = job.Content.Metadata.RootContentId;
      let jobCurrId = job.MissionId;

      let jobRaw = {
        jobId: jobId,
        jobCurrId: jobCurrId,
        job: job,
        updated: new Date(),
        uploaded: false
      }

      JobRaw.findOneAndUpdate(
        { jobId: jobId }, jobRaw, config.mongo.standardUpdateOptions
      )
        .then(res => {
          let text = (res) ? 'updated' : 'added';
          console.log(`${++i} \t ${jobId} ${text}`);
        })
        .catch(err => {
          console.log(`Error: ${err.code}`);
        });
    });

    if (isCrew && !updatedCrewInfo) {
      updatedCrewInfo = true;

      Crew.findOneAndUpdate(
        { crewId: params.id },
        {
          uploadedLast: new Date()
        },
        config.mongo.standardUpdateOptions,
        (err, doc) => {}
      );
    }
  }

  fetchJobs(params, recordJobs)
  res.send('Started fetching jobs...');
});

router.get('/addcrew', (req, res, next) => {
  let url = req.query.url.trim();
  if (!url) return next('Enter a link to the crew page.');

  let urlMatch = url.match(/\s*crew\/([\w-]+)\s*$/);
  if (!urlMatch) return next('Incorrect link');

  let crew = {};
  crew.url = url.split('/')[4];

  request(`https://socialclub.rockstargames.com/crew/${crew.url}`)
    .then(body => {
      let idAndAvatarMatch = body.match(/crews\/sc\/(\d+)\/(\d+)\/publish\//);
      let nameMatch = body.match(/\\"crewname\\":\\"([\w -]+)\\"/);
      let tagMatch = body.match(/\\"tag\\":\\"(\w+)\\"/);
      let colorMatch = body.match(/\\"crewColor\\":\\"#(\w+)\\"/);

      if (!idAndAvatarMatch || !nameMatch || !tagMatch || !colorMatch) {
        throw new Error(`Cannot find the '${crew.url}' crew`);
      }

      crew.crewId = idAndAvatarMatch[2];
      crew.name = nameMatch[1];
      crew.tag = tagMatch[1];
      crew.color = colorMatch[1];
      crew.avatar = idAndAvatarMatch[1];
      crew.updated = new Date();

      Crew.findOneAndUpdate(
        { crewId: crew.crewId },
        crew,
        config.standardUpdateOptions,
        (err, res) => {
          if (err) return next(`Error ${err.code} occured. Try again later`);

          let text = (res) ? 'updated' : 'added';
          res.send(`Crew '<a href="https://socialclub.rockstargames.com/crew/` +
          `${crew.url}" target="_blank">${crew.name}</a>' has been ` +
          `successfully ${text}.`);
        }
      );
    })
    .catch(next);
});
