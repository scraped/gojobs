const config = require('../config');
const request = require('request-promise');

module.exports = getRGSCJobs;

const jobsPerResponse = 20;

const urls = {
  step1: 'https://ru.socialclub.rockstargames.com/',
  step2: 'https://ru.socialclub.rockstargames.com/games/gtav/pc/jobs/',
  step3: 'https://socialclub.rockstargames.com/games/gtav/ajax/search'
};

const regexes = {
  cookieRegex: /=([^;]*)/,
  tokenRegex: /value="([a-z0-9_-]*)" \/>/mi
}

function getRGSCJobs(params, callback) {
  let { searchBy, period, once, limit } = params;

  searchBy = searchBy || {};
  searchBy.type = searchBy.type || 'members';
  limit = once ? 0 : Math.abs(Number(limit));

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
  // '', 'today', 'last7', 'lastMonth'
  if (period) formData.SearchOptDate = period;

  let options = {
    uri: urls.step1,
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

      options.uri = urls.step2;
      options.headers.Cookie = `UAGD=1/1/1990; UAGC=1; gtav_jobsview=cols; ` +
        `CSRFToken=${cookies.CSRFToken}; prod=${cookies.prod};` +
        `RockStarWebSessionId=${cookies.RSWSID};`;
      options.resolveWithFullResponse = false;

      return request(options);
    })
    .then(body => {
      let tokenMatch = body.match(regexes.tokenRegex);
      if (!tokenMatch) throw new Error('Cannot parse RequestVerificationToken');

      options.uri = urls.step3;
      options.method = 'POST';
      options.headers.RequestVerificationToken = tokenMatch[1];
      options.formData = formData;
      options.json = true;

      return request(options);
    })
    .then(jobs => {
      let jobsTotal = jobs.Total;
      let jobsProcessed = jobs.Count;
      if (!jobsTotal) throw new Error('No jobs found');

      callback(jobs);

      console.log(jobsProcessed, limit);
      if (jobsTotal === jobsProcessed
        || once
        || (limit && jobsProcessed >= limit)) return;

      const maxIterations = Math.ceil(
        (jobsTotal - jobsProcessed) / jobsPerResponse
      );

      for (let i = 0; i < maxIterations; i++) {
        options.formData.offset = (i + 1) * jobsPerResponse;
        request(options).then(callback);
      }
    })
    .catch(error => {
      console.error(`[getRGSCJobs] ${error}`);
    });
};
