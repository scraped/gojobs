const config = require('../config');
const request = require('request-promise');

module.exports = getRGSCJobs;

const jobsPerResponse = 20;
const mainPageUri = 'https://socialclub.rockstargames.com/';
const jobsPageUri = 'https://socialclub.rockstargames.com/games/gtav/';

const regexes = {
  cookieRegex: /=([^;]*)/,
  tokenRegex: /value="([a-z0-9_-]*)" \/>/mi
}

/**
 * Calls the callback when gets another portion of jobs.
 *
 * @param {Object} params parameters the function are working with
 * @param {Object} params.searchBy search by..
 * @param {string} params.searchBy.type 'members' (default), 'crew', 'rockstar',
 * 'rstarverified'
 * @param {mixed} params.searchBy.id username or crew id
 * @param {string} params.platform 'pc' (deflt), 'ps4', 'xbox', 'ps3', 'xboxone'
 * @param {string} params.period '' (default), 'today', 'last7', 'lastMonth'
 * @param {boolean} params.once should we fetch only once
 * @param {number} params.limit jobs limit, doesn't matter when once is true
 * @param {function} callback to be called
 */
function getRGSCJobs(params, callback) {
  let { searchBy, platform, period, once, limit } = params;

  searchBy = searchBy || {};
  searchBy.type = searchBy.type || 'members';
  platform = platform || 'pc';
  limit = once ? 0 : Math.min(1000, Math.abs(Number(limit)));

  let formData = {
    onlyCount: 'false',
    offset: 0,
    SearchOptSort: 'Liked',
  };

  if (searchBy.type === 'member') {
    formData.SearchOptPublisher = 'named';
    formData.SearchOptNamed = searchBy.id;
  } else if (searchBy.type === 'crew') {
    formData.SearchOptPublisher = `crew${searchBy.id}`;
  } else {
    formData.SearchOptPublisher = searchBy.type;
  }

  if (period) formData.SearchOptDate = period;

  console.log(formData);

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

      cookies.RSWSID = cookies[1].match(regexes.cookieRegex)[1];
      cookies.CSRFToken = cookies[2].match(regexes.cookieRegex)[1];
      cookies.prod = cookies[3].match(regexes.cookieRegex)[1];

      options.uri = `${jobsPageUri}${platform}/jobs/`;
      options.headers.Cookie = `UAGD=1/1/1990; UAGC=1; gtav_jobsview=cols; ` +
        `CSRFToken=${cookies.CSRFToken}; prod=${cookies.prod};` +
        `RockStarWebSessionId=${cookies.RSWSID};`;
      options.resolveWithFullResponse = false;

      return request(options);
    })
    .then(body => {
      let tokenMatch = body.match(regexes.tokenRegex);
      if (!tokenMatch) throw new Error('Cannot parse RequestVerificationToken');

      options.uri = `${jobsPageUri}ajax/search`;
      options.method = 'POST';
      options.headers.RequestVerificationToken = tokenMatch[1];
      options.formData = formData;
      options.json = true;

      return request(options);
    })
    .then(jobs => {
      let jobsTotal = jobs.Total;
      let jobsCount = jobs.Count;
      if (!jobsTotal) throw new Error('No jobs found');

      callback(jobs);
      if (once
        || jobsTotal === jobsCount
        || (limit && limit <= jobsPerResponse)) return;

      const maxIterations = Math.ceil(
        (limit || jobsTotal) / jobsPerResponse
      ) - 1;

      for (let i = 0; i < maxIterations; i++) {
        options.formData.offset = (i + 1) * jobsPerResponse;
        request(options).then(callback);
      }
    })
    .catch(error => {
      console.error(`[fetchRGSCJobs] ${error}`);
    });
};
