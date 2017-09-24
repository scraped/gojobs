const config = require('../config');
const request = require('request-promise');
const number = require('lodash/number');

module.exports = fetchJobs;

const jobsPerResponse = 20;
const maxJobs = 5000;
const mainPageUri = 'https://socialclub.rockstargames.com/';
const jobsPageUri = 'https://socialclub.rockstargames.com/games/gtav/';

const cookieRegex = /=([^;]*)/;
const tokenRegex = /value="([a-z0-9_-]*)" \/>/mi;

function genQuery(params) {
  let { by = 'members', id, period } = params;

  let formData = { onlyCount: 'false', offset: 0, SearchOptSort: 'Liked' };

  switch (by) {
    case 'member':
      formData.SearchOptPublisher = 'named';
      formData.SearchOptNamed = id;
      break;

    case 'crew':
      formData.SearchOptPublisher = `crew${id}`;
      break;

    default:
      formData.SearchOptPublisher = by;
  }

  if (period) formData.SearchOptDate = period;

  return formData;
}

/**
 * Calls the callback when gets another portion of jobs.
 *
 * @param {Object} params parameters the function are working with
 * @param {string} params.by members, crew, rockstar, rstarverified
 * @param {mixed} params.id username or crew id
 * @param {string} params.platform pc (default), ps4, xbox
 * @param {string} params.period <empty>, today, last7, lastMonth
 * @param {number} params.limit jobs limit
 * @param {function} callback function to be called per 20 jobs
 */

function fetchJobs(params, callback) {
  let { platform = 'pc', limit } = params;

  limit = limit ? number.clamp(limit, jobsPerResponse, maxJobs) : maxJobs;

  const formData = genQuery(params);

  let options = {
    uri: mainPageUri,
    resolveWithFullResponse: true,
    headers: {
      'Accept-Language': 'en-US,en',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 ' +
      'Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    }
  };

  request(options)
    .then(res => {
      let cookies = res.headers['set-cookie'];
      if (!cookies) throw new Error('Cannot fetch cookies');

      try {
        cookies.RSWSID = cookies[1].match(cookieRegex)[1];
        cookies.CSRFToken = cookies[2].match(cookieRegex)[1];
        cookies.prod = cookies[3].match(cookieRegex)[1];
      } catch (e) {
        throw new Error('Cannot parse cookies');
      }

      options.uri = `${jobsPageUri}${platform}/jobs/`;
      options.headers.Cookie = `UAGD=1/1/1990; UAGC=1; gtav_jobsview=cols; CSRFToken=${cookies.CSRFToken}; prod=${cookies.prod}; RockStarWebSessionId=${cookies.RSWSID};`;
      options.resolveWithFullResponse = false;

      return request(options);
    })
    .then(body => {
      let tokenMatch = body.match(tokenRegex);
      if (!tokenMatch) throw new Error('Cannot parse token');

      options.uri = `${jobsPageUri}ajax/search`;
      options.method = 'POST';
      options.headers.RequestVerificationToken = tokenMatch[1];
      options.formData = formData;
      options.json = true;

      return request(options);
    })
    .then(jobs => {
      if (!jobs.Total) throw new Error('No jobs found');

      callback(jobs);

      const it = Math.ceil(Math.min(limit, jobs.Total) / jobsPerResponse) - 1;

      for (let i = 0; i < it; i++) {
        options.formData.offset = (i + 1) * jobsPerResponse;
        request(options).then(callback).catch(function(err) {
          throw err;
        })
      }
    })
    .catch(err => {
      console.log(`[fetch-jobs] ${err.stack}`)
    });
};