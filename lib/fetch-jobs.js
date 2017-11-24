const request = require('request-promise');
const number = require('lodash/number');

module.exports = fetchJobs;

/**
 * Fetches jobs from RGSC site.
 *
 * @param {Object} params function parameters
 * @param {string} params.by members, crew, rockstar, rstarverified
 * @param {mixed} params.id username or crew id
 * @param {string} params.platform pc (default), ps4, xbox
 * @param {string} params.period <empty>, today, last7, lastMonth
 * @param {number} params.limit jobs limit
 * @param {number} params.skip how many jobs to skip
 * @return {Promise} fulfilled promise returns object {jobs[], amount, fetched}
 * jobs[] is an array that can contain jobs and/or errors.
 */
async function fetchJobs(params) {
  const jobsPerResponse = 20;
  const maxJobs = 1000;
  const mainPageUri = 'https://socialclub.rockstargames.com/';
  const jobsPageUri = `https://socialclub.rockstargames.com/games/gtav/`;

  const cookieRegex = /=([^;]*)/;
  const tokenRegex = /value="([a-z0-9_-]*)" \/>/mi;

  let {
    platform = 'pc',
    limit = maxJobs,
    by = 'members',
    id,
    period,
    skip = 0
  } = params;

  limit = number.clamp(limit, jobsPerResponse, maxJobs);

  // 1. Fetch main page

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

  // 2. Fetch jobs list

  options.uri = `${jobsPageUri}${platform}/jobs/`;
  options.headers.Cookie = `UAGD=1/1/1990; UAGC=1; gtav_jobsview=cols; CSRFToken=${cookies.CSRFToken}; prod=${cookies.prod}; RockStarWebSessionId=${cookies.RSWSID};`;
  options.resolveWithFullResponse = false;

  let jobsListPage = await request(options);

  let tokenMatch = jobsListPage.match(tokenRegex);
  if (!tokenMatch) throw new Error('Cannot parse token');

  // 3. Fetch first bunch of jobs

  options.uri = `${jobsPageUri}ajax/search`;
  options.method = 'POST';
  options.headers.RequestVerificationToken = tokenMatch[1];
  options.formData = genQuery({ by, id, period, skip });
  options.json = true;

  let jobsFirst = await request(options);

  let amount = jobsFirst.Total;

  if (!amount) {
    throw new Error('No jobs found');
  }

  // 4. Fetch remaining jobs

  const it = Math.ceil(Math.min(limit, amount) / jobsPerResponse);

  let requests = new Array(it);
  for (let i = 0; i < it; i++) {
    options.formData.offset = i * jobsPerResponse;
    requests[i] = request(options);
  }

  let jobs = await Promise.all(
    requests.map(request => request.catch(err => err))
  );

  let fetched = jobs.reduce((sum, curr) => {
    let amount = (curr instanceof Error) ? 0 : curr.Count;
    return sum + amount;
  }, 0);

  return { jobs, amount, fetched };
}

function genQuery({ by, id, period, skip }) {
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

  if (period) {
    formData.SearchOptDate = period;
  }

  return formData;
}
