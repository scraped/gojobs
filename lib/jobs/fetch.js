const axios = require('axios');
const { serializeCookies } = require('../helpers');

const JOBS_PER_RESPONSE = 20;

exports.fetchAllRgscJobs = fetchAllRgscJobs;
exports.JOBS_PER_RESPONSE = JOBS_PER_RESPONSE;

/**
 * Fetches all jobs from RGSC site based on the options object
 * @param {object} options see fetchAndSave function.
 * @param {object} kueJob kue job object
 * @returns {Promise<object>} fulfilled promise returns object
 * {jobs[], number, numberFetched}
 * jobs[] is an array that can contain RGSC responses and/or errors.
 */
async function fetchAllRgscJobs(options, kueJob) {
  const { limit, skip } = options;

  let axiosOptions = await genAxiosOptionsToFetchJobs(options);

  axiosOptions.url = `/games/gtav/ajax/search`;
  axiosOptions.method = 'post';

  // Fetch first bunch of jobs

  axiosOptions.data = genQuery(options);

  const jobsFirstBunch = await axios(axiosOptions);

  const number = Math.min(limit, jobsFirstBunch.data.Total),
    iterationsAmount = Math.ceil(number / JOBS_PER_RESPONSE);

  let requests = [],
    responses = [],
    jobs = jobsFirstBunch.data.Missions || [];

  // NOTE that we have already fetched the first bunch of jobs,
  // therefore we start with i = 1
  for (let i = 1; i < iterationsAmount; i++) {
    const currSkip = skip + i * JOBS_PER_RESPONSE;
    axiosOptions.data = genQuery(Object.assign(options, { skip: currSkip }));
    requests.push(
      axios(axiosOptions).catch(err => err)
    );
  }

  responses = await Promise.all(requests);

  responses.forEach(response => {
    if (response instanceof Error) {
      kueJob.log('Error during the request: %s', response.message);
      return;
    }
    jobs.push(...response.data.Missions);
  });

  return {
    jobs,
    numberFetched: jobs.length,
    number
  };
}

/**
 * Generates axios 'options' object for fetching jobs from RGSC site.
 * @param {object} options see fetchAndSave function (fetch-save.js)
 * @returns {Promise<object>} axios 'options' object.
 */
async function genAxiosOptionsToFetchJobs(options) {
  const baseURL = 'https://socialclub.rockstargames.com/',
    cookieRegex = /=([^;]*)/,
    tokenRegex = /value="([a-z0-9_-]*)" \/>/mi;

  const { platform } = options;

  // Note that "baseURL" is the only valid axios option,
  // not "baseUrl" or something!
  let axiosOptions = {
    baseURL,
    headers: {
      'Accept-Language': 'en-US,en',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    }
  };

  // 1. Fetch main page, parse cookies
  const mainPage = await axios(axiosOptions);

  const cookies = mainPage.headers['set-cookie'];

  if (!Array.isArray(cookies)) {
    throw new Error('No cookies detected')
  }

  const parsedCookies = {
    RSWSID: cookies[0].match(cookieRegex)[1],
    CSRFToken: cookies[1].match(cookieRegex)[1],
    prod: cookies[2].match(cookieRegex)[1]
  };

  // 2. Fetch jobs list page
  axiosOptions.url = `/games/gtav/${platform}/jobs/`;
  axiosOptions.headers.Cookie = serializeCookies({
    UAGD: '1/1/1990',
    UAGC: 1,
    gtav_jobsview: 'cols',
    CSRFToken: parsedCookies.CSRFToken,
    prod: parsedCookies.prod,
    RockStarWebSessionId: parsedCookies.RSWSID
  });

  const jobsListPage = await axios(axiosOptions);

  const rqvrfTokenMatch = jobsListPage.data.match(tokenRegex);

  if (!rqvrfTokenMatch) {
    throw new Error('Cannot parse RequestVerificationToken');
  }

  // 3. Add RequestVerificationToken to the header
  axiosOptions.headers.RequestVerificationToken = rqvrfTokenMatch[1];

  return axiosOptions;
}

/**
 * Fetches extended job object
 * @param {string} jobId rockstar job id
 * @returns {undefined}
 */
async function fetchJob(jobId) {
  // todo
}

/**
 * Generates query object to fetch RGSC jobs
 * @param {object} options see fetchAndSave function (fetch-save.js)
 * @returns {object} query object
 */
function genQuery(options) {
  const {
    by,
    username,
    crewId,
    period,
    skip
  } = options;

  let data = {
    onlyCount: 'false',
    offset: skip,
    SearchOptSort: 'Liked'
  };

  switch (by) {
    case 'member':
      data.SearchOptPublisher = 'named';
      data.SearchOptNamed = username;
      break;

    case 'crew':
      data.SearchOptPublisher = `crew${crewId}`;
      break;

    default:
      data.SearchOptPublisher = by;
  }

  if (period) {
    data.SearchOptDate = period;
  }

  return data;
}
