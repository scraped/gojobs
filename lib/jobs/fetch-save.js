const axios = require('axios');
const number = require('lodash/number');

module.exports = fetchAndUpload;

/**
 * Fetches jobs from RGSC site & save them in DB.
 * @param {object}  options          options:
 * @param {string}  options.by       members, crew, rockstar, rstarverified
 * (default: members)
 * @param {mixed}   options.id       username or crew id
 * @param {string}  options.platform pc, ps4, xbox (default: pc)
 * @param {string}  options.period   <empty>, today, last7, lastMonth
 * (default: empty)
 * @param {number}  options.limit    jobs limit (default: 20)
 * @param {number}  options.skip     how many jobs to skip (default: 0)
 * @returns {Promise} empty promise.
 */
async function fetchAndUpload(options) {
  console.log('Fetching jobs from RGSC with the following params:', options);

  const { jobs, amount, fetched } = await fetchJobs(options);
  let jobsToSave = [];

  console.log(`Fetching over. ${fetched}/${amount} jobs actually fetched.`);

  jobs.forEach(job => {
    if (job instanceof Error) {
      console.log(``)
    }
  });

  if (fetched === 0) return;

  console.log(`Saving ${fetched} jobs to the DB.`);


}

async function saveJob(job) {

}

/**
 * Fetches jobs from RGSC site.
 * @param {object} options see fetchAndUpload function.
 * @returns {Promise} fulfilled promise returns object {jobs[], amount, fetched}
 * jobs[] is an array that can contain RGSC responses and/or errors.
 */
async function fetchJobs(options) {
  const JOBS_PER_RESPONSE = 20,
    JOBS_LIMIT = 1000,
    baseURL = 'https://socialclub.rockstargames.com/',
    jobsPage = `/games/gtav`,
    cookieRegex = /=([^;]*)/,
    tokenRegex = /value="([a-z0-9_-]*)" \/>/mi;

  let {
    platform = 'pc',
    limit = JOBS_LIMIT,
    by = 'members',
    id,
    period,
    skip = 0
  } = options;

  limit = number.clamp(limit, JOBS_PER_RESPONSE, JOBS_LIMIT);

  let axiosOptions = {
    baseURL,
    headers: {
      'Accept-Language': 'en-US,en',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    }
  };

  // 1. Fetch main page & parse cookies

  const mainPage = (await axios(axiosOptions)).data;

  const cookies = mainPage.headers['set-cookie'];

  try {
    cookies.RSWSID = cookies[1].match(cookieRegex)[1];
    cookies.CSRFToken = cookies[2].match(cookieRegex)[1];
    cookies.prod = cookies[3].match(cookieRegex)[1];
  } catch (e) {
    throw new Error('Cannot parse cookies');
  }

  // 2. Fetch jobs list page

  axiosOptions.url = `${jobsPage}/${platform}/jobs/`;
  axiosOptions.headers.Cookie = [
    'UAGD=1/1/1990',
    'UAGC=1',
    'gtav_jobsview=cols',
    `CSRFToken=${cookies.CSRFToken}`,
    `prod=${cookies.prod}`,
    `RockStarWebSessionId=${cookies.RSWSID};`
  ].join('; ');

  const jobsListPage = (await axios(axiosOptions)).data;

  const rqvrfTokenMatch = jobsListPage.match(tokenRegex);

  if (!rqvrfTokenMatch) {
    throw new Error('Cannot parse token');
  }

  // 3. Fetch first bunch of jobs

  axiosOptions.url = `${jobsPage}/ajax/search`;
  axiosOptions.method = 'post';
  axiosOptions.headers.RequestVerificationToken = rqvrfTokenMatch[1];
  axiosOptions.data = genQuery({ by, id, period, skip });

  const jobsFirstBlock = (await axios(axiosOptions)).data;

  const amount = jobsFirstBlock.Total;

  if (!amount) {
    throw new Error('No jobs found');
  }

  // 4. Fetch remaining jobs

  const it = Math.ceil(Math.min(limit, amount) / JOBS_PER_RESPONSE);

  let requests = [];
  for (let i = 0; i < it; i++) {
    axiosOptions.data.offset = i * JOBS_PER_RESPONSE;
    requests[i] = axios(axiosOptions);
  }

  const responses = await Promise.all(
    requests.map(request => request.catch(err => err))
  );

  const fetched = responses.reduce((sum, curr) => {
    const amount = (curr instanceof Error) ? 0 : curr.Count;
    return sum + amount;
  }, 0);

  return { jobs, amount, fetched };
}

function genQuery({ by, id, period, skip }) {
  let data = {
    onlyCount: 'false',
    offset: skip,
    SearchOptSort: 'Liked'
  };

  switch (by) {
    case 'member':
      data.SearchOptPublisher = 'named';
      data.SearchOptNamed = id;
      break;

    case 'crew':
      data.SearchOptPublisher = `crew${id}`;
      break;

    default:
      data.SearchOptPublisher = by;
  }

  if (period) {
    data.SearchOptDate = period;
  }

  return data;
}
