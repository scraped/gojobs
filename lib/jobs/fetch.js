const axios = require('axios');
const { serializeCookies } = require('../helpers');

const JOBS_PER_RESPONSE = 20;

module.exports = {
  fetchAllRgscJobs,
  fetchBunches,
  JOBS_PER_RESPONSE
};


async function fetchBunches(options) {
  const {
    category,
    id,
    platform,
    period,
    limit,
    skip
  } = options;

  
}

/**
 * Fetches all jobs from RGSC site based on the options object
 * @param {object} options see fetchAndSave function.
 * @param {object} kueJob kue job object
 * @returns {Promise<object>} fulfilled promise returns object
 * {jobs[], number, numberFetched}
 * jobs[] is an array that can contain RGSC responses and/or errors.
 */
async function fetchAllRgscJobs(options, kueJob) {
  const { by, key, limit, skip } = options;

  let axiosOptions = await genAxiosOptionsToFetchJobs(options);

  let totalJobs = 0;
  let jobsIds = [];

  if (by === 'job') {
    totalJobs = 1;
    jobsIds.push(key);
  } else {
    //
    // I. Fetch jobs IDs
    //
    axiosOptions.url = '/games/gtav/ajax/search';
    axiosOptions.method = 'post';
    axiosOptions.data = genQuery(options);

    const jobsFirstBunch = await axios(axiosOptions);

    totalJobs = Math.min(limit, jobsFirstBunch.data.Total);

    if (Array.isArray(jobsFirstBunch.data.Missions)) {
      jobsIds = jobsFirstBunch.data.Missions.map(mission => mission.MissionId);
    }

    const iterations = Math.ceil(totalJobs / JOBS_PER_RESPONSE);

    let requests = [],
      responses = [];

    // NOTE that we have already fetched the first bunch of jobs,
    // therefore we start with i = 1
    for (let i = 1; i < iterations; i++) {
      const currSkip = skip + i * JOBS_PER_RESPONSE;
      axiosOptions.data = genQuery(
        Object.assign(options, { skip: currSkip })
      );
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
      jobsIds.push(
        ...response.data.Missions.map(mission => mission.MissionId)
      );
    });

    // In case there are more jobs that we needed
    jobsIds.length = Math.min(jobsIds.length, limit);
  }

  //
  // II. Fetch extended objects
  //
  let requests = [],
    responses = [],
    jobs = [];

  axiosOptions.url = '/games/gtav/ajax/mission';
  axiosOptions.method = 'get';
  axiosOptions.data = null;

  for (let i = 0; i < jobsIds.length; i++) {
    const missionid = jobsIds[i];
    if (missionid) {
      axiosOptions.params = { missionid };
      requests.push(
        axios(axiosOptions).catch(err => err)
      );
    }
  }

  responses = await Promise.all(requests);

  responses.forEach(response => {
    if (response instanceof Error) {
      kueJob.log('Error during the request: %s', response.message);
      return;
    }
    jobs.push(response.data);
  });

  return {
    totalJobs,
    jobs
  };
}

/**
 * Generates axios 'options' object for fetching jobs from RGSC site:
 * 1) adds baseURL property
 * 2) adds a proper "Cookie" header
 * 3) adds "RequestVerificationToken" header
 * 4) adds "X-Requested-With: XMLHttpRequest" header
 * 5) adds other necessary headers
 * @param {object} options see fetchAndSave function (fetch-save.js)
 * @returns {Promise<object>} axios 'options' object.
 */
async function genAxiosOptionsToFetchJobs(options) {
  const baseURL = 'https://socialclub.rockstargames.com/',
    cookieRegex = /=([^;]*)/,
    tokenRegex = /value="([a-z0-9_-]*)" \/>/mi;

  const { platform } = options;

  // Note that "baseURL" is the only valid axios option,
  // not "baseUrl" and whatnot!
  let axiosOptions = {
    baseURL,
    headers: {
      'Accept-Language': 'en-US,en',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    }
  };

  // 1. Fetch main page & parse cookies
  const cookies = (await axios(axiosOptions)).headers['set-cookie'];

  if (!Array.isArray(cookies)) {
    throw new Error('No cookies detected');
  }

  const RockStarWebSessionId = cookies[0].match(cookieRegex)[1],
    CSRFToken = cookies[1].match(cookieRegex)[1],
    prod = cookies[2].match(cookieRegex)[1];

  // 2. Fetch job list page
  axiosOptions.headers.Cookie = serializeCookies({
    UAGD: '1/1/1990',
    UAGC: 1,
    gtav_jobsview: 'cols',
    RockStarWebSessionId,
    CSRFToken,
    prod,
  });

  axiosOptions.url = `/games/gtav/${platform}/jobs/`;

  const jobsListPage = await axios(axiosOptions);

  const requestVerifTokenMatch = jobsListPage.data.match(tokenRegex);

  if (!requestVerifTokenMatch) {
    throw new Error('Cannot parse RequestVerificationToken');
  }

  // 3. Add RequestVerificationToken to the header
  axiosOptions.headers.RequestVerificationToken = requestVerifTokenMatch[1];

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
    key,
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
      data.SearchOptNamed = key;
      break;

    case 'crew':
      data.SearchOptPublisher = `crew${key}`;
      break;

    default:
      data.SearchOptPublisher = by;
  }

  if (period) {
    data.SearchOptDate = period;
  }

  return data;
}
