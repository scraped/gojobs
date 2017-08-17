const config  = require('../config');
const request   = require('request');
const mongoose  = require('mongoose');
mongoose.connect(config.mongo.connectUri, config.mongo.options);
const JobRawModel = require('../models/jobRaw.js');

const urls = {
  step1: 'https://ru.socialclub.rockstargames.com/',
  step2: 'https://ru.socialclub.rockstargames.com/games/gtav/pc/jobs/',
  step3: 'https://socialclub.rockstargames.com/games/gtav/ajax/search'
};

let formData = {
  onlyCount: 'false',
  offset: 0,
  SearchOptSubType: '',
  SearchOptDate: 'last7',
  SearchOptSort: 'Liked',
  SearchOptPlayers: '',
  SearchText: ''
};

let options = {
  url: urls.step1,
  headers: {
    'Accept-Language': 'ru-RU,ru',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36'
  }
};

function getRGSCJobs(searchBy) {
  searchBy = searchBy || {};

  if (searchBy.member) {
    formData.SearchOptPublisher = 'members';
    formData.SearchOptNamed = searchBy.member;
  } else if (searchBy.crew) {
    formData.SearchOptPublisher = 'crew' + searchBy.crew;
  }

  request(options, (err, res, body) => {
    let cookies = res.headers['set-cookie'];
    cookies['RSWSID']     = cookies[1].match(/=([^;]*)/)[1];
    cookies['CSRFToken']  = cookies[2].match(/=([^;]*)/)[1];
    cookies['prod']       = cookies[3].match(/=([^;]*)/)[1];

    options.headers.Cookie = 'UAGD=1/1/1990; UAGC=1; gtav_jobsview=cols; ' +
    'CSRFToken=' + cookies['CSRFToken'] + '; prod=' + cookies['prod'] + '; ' +
    'RockStarWebSessionId=' + cookies['RSWSID'] + ';';
    options.url = urls.step2;

    request(options, (err2, res2, body2) => {
      const token = body2.match(/value="([a-zA-Z0-9_-]*)" \/>\s*<\/div/mi);

      options.url = urls.step3;
      options.headers.RequestVerificationToken = token[1];
      options.headers['X-Requested-With'] = 'XMLHttpRequest';
      options.method = 'POST';
      options.formData = formData;

      let jobsTotal = 0;
      let jobsProcessed = 0;

      do {
        console.log('here');
        request(options, (err3, res3, body3) => {
          console.log('here');
          if (err3) throw new Error();
          let jobs = JSON.parse(body3);

          if (!jobsTotal) {
            jobsTotal = jobs.Total;
          }

          if (!jobsTotal) {
            jobsProcessed += jobs.Count;
            jobs.Missions.forEach(
              job => new JobRawModel(job).save(err => console.log)
            );
          }
        });
      } while (jobsProcessed != jobsTotal);
    });
  });
};

module.exports = getRGSCJobs;
