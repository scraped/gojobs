const request = require('request-promise');
const number = require('lodash/number');

module.exports = fetchJobs;

const jobsPerResponse = 20;
const maxJobs = 500;
const mainPageUri = 'https://socialclub.rockstargames.com/';
const jobsPageUri = `https://socialclub.rockstargames.com/games/gtav/`;

const cookieRegex = /=([^;]*)/;
const tokenRegex = /value="([a-z0-9_-]*)" \/>/mi;

/**
 * Calls the callback when gets another portion of jobs.
 *
 * @param {Object} params parameters the function is working with
 * @param {string} params.by members, crew, rockstar, rstarverified
 * @param {mixed} params.id username or crew id
 * @param {string} params.platform pc (default), ps4, xbox
 * @param {string} params.period <empty>, today, last7, lastMonth
 * @param {number} params.limit jobs limit
 * @param {number} params.skip how many jobs to skip
 * @return {Promise} fulfilled promise returns object {jobs[], total, fetched}
 */

async function fetchJobs(params) {
  let { platform = 'pc', limit = maxJobs } = params;

  limit = number.clamp(limit, jobsPerResponse, maxJobs);

  let options = {
    uri: mainPageUri,
    resolveWithFullResponse: true,
    headers: {
      'Accept-Language': 'en-US,en',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    }
  };

  let mainPage = await request(options);

  let cookies = mainPage.headers['set-cookie'];

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

  let jobsListPage = await request(options);

  let tokenMatch = jobsListPage.match(tokenRegex);
  if (!tokenMatch) throw new Error('Cannot parse token');

  options.uri = `${jobsPageUri}ajax/search`;
  options.method = 'POST';
  options.headers.RequestVerificationToken = tokenMatch[1];
  options.formData = genQuery(params);
  options.json = true;

  let jobsFirst = await request(options);

  let jobsAmount = jobsFirst.Total;
  if (!jobsAmount) throw new Error('No jobs found');

  const it = Math.ceil(Math.min(limit, jobsAmount) / jobsPerResponse);

  let requests = new Array(it);
  for (let i = 0; i < it; i++) {
    options.formData.offset = i * jobsPerResponse;
    requests[i] = request(options);
  }

  let jobs = await Promise.all(
    requests.map(request => request.catch(err => err))
  );

  return {
    jobs: jobs,
    total: jobs[0].Total,
    fetched: jobs.reduce((prev, curr) => prev + curr.Count, 0)
  };
}

function genQuery(params) {
  let { by = 'members', id, period, skip = 0 } = params;

  let formData = {
    onlyCount: 'false',
    offset: skip,
    SearchOptSort: 'Liked'
  };

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
