const config = require('../../config');
const router = require('express').Router();
const request = require('request-promise');
const fetchJobs = require('../../lib/fetch-jobs');
const uploadJobs = require('../../lib/upload-jobs');

const mongoose = require('mongoose');
const JobRaw = require('../../models/job-raw');
const Crew = require('../../models/crew');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

module.exports = router;

router.get('/', (req, res) => {
  Crew.find((err, crews) => {
    if (err) return next('Cannot fetch data from database');
    res.locals.partials.crewsContext = crews;
    res.render('admin');
  });
});

router.get('/uploadraw', (req, res, next) => {
  uploadJobs();
  res.send('Check out the console log!');
});

router.get('/fetch', (req, res, next) => {
  let params = {};

  req.query = req.query || {};
  params.searchBy = {};
  params.searchBy.type = req.query.type;
  params.searchBy.id = req.query.id;
  params.platform = req.query.platform;
  params.period = req.query.period;
  params.once = Boolean(req.query.once);
  params.limit = Number(req.query.limit);

  let isCrew = (params.searchBy.type === 'crew');
  let updatedCrewInfo = false;
  let i = 0;

  fetchJobs(params, jobs => {
    let total = params.once ? Math.min(jobs.Total, 20) : jobs.Total;
    let count = jobs.Count;
    console.log(`Should be ${total} jobs, ${jobs.Count} now (LIMIT: ` +
      `${params.limit}], ONCE: ${params.once}, PLATFORM: ${params.platform})`);

    if (isCrew) {

    }

    jobs.Missions.forEach(job => {
      let jobId = job.Content.Metadata.RootContentId;
      let jobCurrId = job.MissionId;

      JobRaw.findOneAndUpdate(
        { jobId: jobId },
        {
          jobId: jobId,
          jobCurrId: jobCurrId,
          job: job,
          updated: new Date(),
          uploaded: false
        },
        config.mongo.standardUpdateOptions,
        (err, res) => {
          if (err) {
            console.log(`Error: ${err.code}`);
          } else {
            let text = (res) ? 'updated' : 'added';
            console.log(`${++i} \t ${jobId} ${text}`);
          }
        }
      );
    });

    if (isCrew && !updatedCrewInfo) {
      updatedCrewInfo = true;

      Crew.findOneAndUpdate(
        { crewId: params.searchBy.id },
        {
          uploadedLast: new Date()
        },
        config.mongo.standardUpdateOptions,
        (err, doc) => {}
      );
    }
  });

  res.send(`Got it, check out the console log!`);
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
        return next(`Cannot find the '${crew.url}' crew`);
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
