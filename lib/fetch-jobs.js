const config    = require('../config');
const request   = require('request');
const mongoose  = require('mongoose');
const JobRaw    = require('../models/jobRaw.js');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

module.exports = getRGSCJobs;

const jobsPerResponse = 20;

const urls = {
  step1: 'https://ru.socialclub.rockstargames.com/',
  step2: 'https://ru.socialclub.rockstargames.com/games/gtav/pc/jobs/',
  step3: 'https://socialclub.rockstargames.com/games/gtav/ajax/search'
};

const regexes = {
  cookie: /=([^;]*)/,
  token:  /value="([a-zA-Z0-9_-]*)" \/>\s*<\/div/mi
}

function formQuery(offset, searchBy) {
  let formData = {
    onlyCount: 'false',
    offset: offset,
    SearchOptSubType: '',
    SearchOptDate: '',
    SearchOptSort: 'Liked',
    SearchOptPlayers: '',
    SearchOptPublisher: 'members',
    SearchText: ''
  };

  if (searchBy.member) {
    formData.SearchOptPublisher = 'named';
    formData.SearchOptNamed = searchBy.member;
  } else if (searchBy.crew) {
    formData.SearchOptPublisher = 'crew' + searchBy.crew;
  }

  return formData;
}

function getRGSCJobs(searchBy) {
  searchBy = searchBy || {};

  let jobsTotal = 0;
  let jobsProcessed = 0;
  let options = {
    url: urls.step1,
    headers: {
      'Accept-Language': 'ru-RU,ru',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    }
  };

  request(options, (err, res, body) => {
    let cookies = res.headers['set-cookie'];
    if (!cookies) throw new Error('Cannot fetch cookies');
    cookies.RSWSID     = cookies[1].match(regexes.cookie)[1];
    cookies.CSRFToken  = cookies[2].match(regexes.cookie)[1];
    cookies.prod       = cookies[3].match(regexes.cookie)[1];

    options.headers.Cookie = `UAGD=1/1/1990; UAGC=1; gtav_jobsview=cols; ` +
    `CSRFToken=${cookies.CSRFToken}; prod=${cookies.prod};` +
    `RockStarWebSessionId=${cookies.RSWSID};`;
    options.url = urls.step2;

    request(options, (err, res, body) => {
      const token = body.match(regexes.token);

      options.url = urls.step3;
      options.headers.RequestVerificationToken = token[1];
      options.method = 'POST';
      options.formData = formQuery(0, searchBy);

      request(options, (err, res, jobs) => {
        if (err) throw new Error(`Cannot fetch data: ${err}`);
        try {
          jobs = JSON.parse(jobs);
        } catch (e) {
          throw new Error(`Cannot parse data: ${e}`);
        }
        if (!jobsTotal) jobsTotal = jobs.Total;
        saveToDatabase(jobs);
        jobsProcessed += jobs.Count;

        if (jobsTotal > jobsProcessed) {
          const maxIterations = Math.ceil(
            (jobsTotal - jobsProcessed) / jobsPerResponse
          );

          for (let i = 0; i < maxIterations; i++) {
            options.formData = formQuery((i + 1) * 20, searchBy);
            request(options, (err, res, jobs) => {
              if (err) throw new Error(`Cannot fetch data: ${err}`);
              try {
                jobs = JSON.parse(jobs);
              } catch (e) {
                throw new Error(`Cannot parse data: ${e}`);
              }
              saveToDatabase(jobs, jobsProcessed);
              jobsProcessed += jobs.Count;
            });
          }
        }
      });
    });
  });
};

function saveToDatabase(jobs, jobsProcessed = 0) {
  let i = jobsProcessed;
  jobs = jobs || {};

  jobs.Missions.forEach(job => {
    console.log(`(${++i}) \t Uploading job ${job.Content.Metadata.name}`);
    JobRaw.findOneAndUpdate(
      { 'job.MissionId': job.MissionId },
      { job: job, updated: new Date() },
      { upsert: true },
      (err, doc, ress) => {}
    )
    //new JobRaw({ job: job }).save(err => console.log);
  });
}
