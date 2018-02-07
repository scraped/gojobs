const config = require('../../config');
const router = require('express').Router();
const request = require('request-promise');
const fetchJobs = require('../../lib/fetch-jobs');
const uploadJobs = require('../../lib/upload-jobs');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Crew = require('../../models/crew');

module.exports = router;

router.get('/uploadraw', (req, res) => {
  res.send('Jobs is being uploaded');
  uploadJobs();
});

router.get('/fetch', (req, res) => {
  let params = {};
  params.by = req.query.type;
  params.id = req.query.id;
  params.platform = req.query.platform;
  params.period = req.query.period;
  params.once = Boolean(req.query.once);
  params.limit = Number(req.query.limit);

  res.send('Jobs is being uploaded');

  let isCrew = (params.by === 'crew');
  let getCrewInfoPromise = Promise.resolve(false);
  let crewInfo = {};

  if (isCrew) {
    getCrewInfoPromise = Crew.findOne({ crewId: params.id });
  }

  getCrewInfoPromise
    .then(crew => {
      console.log(crew);
      if (crew) {
        crewInfo = crew;
        params.skip = crewInfo.jobsAmount ? Number(crewInfo.jobsAmount.fetched) : 0;
      }

      return fetchJobs(params);
    })
    .then(jobs => {
      jobs.jobs.forEach(recordJobs);

      if (!isCrew) return false;

      return Crew.findOneAndUpdate(
        { crewId: params.id },
        {
          uploadedLast: new Date(),
          'jobsAmount.total': jobs.total,
          'jobsAmount.fetched': jobs.fetched + params.skip
        },
        config.mongo.standardUpdateOptions
      ).exec();
    })
    .then(res => {})
    .catch(err => {
      console.log(`Cannot record jobs: ${err.stack}`);
    });
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
