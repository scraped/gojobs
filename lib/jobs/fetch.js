const axios = require('axios');
const { serializeCookies } = require('../helpers');

const JOBS_PER_RESPONSE = 20;

exports.fetchAllRgscJobs = fetchAllRgscJobs;
exports.JOBS_PER_RESPONSE = JOBS_PER_RESPONSE;

/**
 * Fetches all jobs from RGSC site based on the options object
 * @param {object} options see fetchAndSave function.
 * @returns {Promise<object>} fulfilled promise returns object
 * {jobs[], number, numberFetched}
 * jobs[] is an array that can contain RGSC responses and/or errors.
 */
async function fetchAllRgscJobs(options) {
  const { limit, skip } = options;

  let axiosOptions = {};

  try {
    axiosOptions = await genAxiosOptionsToFetchJobs(options);
  } catch (error) {
    throw error;
  }

  axiosOptions.url = `/games/gtav/ajax/search`;
  axiosOptions.method = 'post';

  // Fetch first bunch of jobs

  axiosOptions.data = genQuery(options);

  const jobsFirstBunch = (await axios(axiosOptions)).data;

  const number = Math.min(limit, jobsFirstBunch.Total),
    iterationsAmount = Math.ceil(number / JOBS_PER_RESPONSE);

  let requests = [],
    responses = [],
    jobs = jobsFirstBunch.Missions || [];

  // NOTE that we have already fetched the first bunch of jobs,
  // therefore we start with i = 1
  for (let i = 1; i < iterationsAmount; i++) {
    const currSkip = skip + i * JOBS_PER_RESPONSE;
    axiosOptions.data = genQuery(Object.assign(options, { skip: currSkip }));
    requests.push(axios(axiosOptions));
  }

  responses = await Promise.all(
    requests.map(request => request.catch(err => err))
  );

  responses.forEach(response => {
    if (response instanceof Error) return;
    response.data.Missions.forEach(jobs.push);
  });

  return {
    jobs,
    number,
    numberFetched: jobs.length
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

  let axiosOptions = {
    baseURL,
    headers: {
      'Accept-Language': 'en-US,en',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    }
  };

  // 1. Fetch main page & parse cookies

  const mainPage = await axios(axiosOptions);

  const cookies = mainPage.headers['set-cookie'];

  let parsedCookies = {};

  try {
    parsedCookies.RSWSID = cookies[0].match(cookieRegex)[1];
    parsedCookies.CSRFToken = cookies[1].match(cookieRegex)[1];
    parsedCookies.prod = cookies[2].match(cookieRegex)[1];
  } catch (e) {
    throw new Error('Cannot parse cookies');
  }

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

  const jobsListPage = (await axios(axiosOptions)).data;

  const rqvrfTokenMatch = jobsListPage.match(tokenRegex);

  if (!rqvrfTokenMatch) {
    throw new Error('Cannot parse RequestVerificationToken');
  }

  // 3. Add RequestVerificationToken to the header

  axiosOptions.headers.RequestVerificationToken = rqvrfTokenMatch[1];

  return axiosOptions;
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
