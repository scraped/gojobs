const axios = require('axios');
const { serializeCookies } = require('../helpers');

const RawJob = require('../../models/raw-job');

const JOBS_PER_RESPONSE = 20;

module.exports = {
  fetchBunches,
  fetchJobObjects,
  JOBS_PER_RESPONSE
};

async function fetchBunches(options) {
  const { limit } = options;

  let bunchesFetched = 0;

  let axiosOptions = await genAxiosOptionsToFetchJobs(options);

  axiosOptions.url = '/games/gtav/ajax/search';
  axiosOptions.method = 'post';
  axiosOptions.data = genQuery(options);

  const firstBunch = await axios(axiosOptions);

  bunchesFetched++;

  let total = firstBunch.data.Total;

  let jobs = firstBunch.data.Missions || [];

  while (bunchesFetched < limit) {
    axiosOptions.data = genQuery(
      Object.assign(options, { skip: bunchesFetched })
    );
    try {
      // eslint-disable-next-line
      const bunch = await axios(axiosOptions);
      bunchesFetched++;
      jobs.push(...bunch.data.Missions);
    } catch (error) {
      bunchesFetched = limit;
    }
  }

  return {
    total,
    jobs
  };
}

async function fetchJobObjects({ jobId }) {
  let axiosOptions = await genAxiosOptionsToFetchJobs({ platform: '' });

  axiosOptions.url = '/games/gtav/ajax/mission';
  axiosOptions.method = 'get';
  axiosOptions.data = null;

  if (jobId) {
    axiosOptions.params = { missionid: jobId };
    const response = await axios(axiosOptions);
    return {
      jobs: [response.data]
    };
  }

  let needFetch = [];

  try {
    needFetch = await RawJob.find({ extended: false }).limit(10000);
  } catch (error) {
    return { jobs: [] };
  }

  let jobs = [];

  for (let i = 0; i < needFetch.length; i++) {
    axiosOptions.params = { missionid: needFetch[i].jobCurrId };
    try {
      // eslint-disable-next-line
      const response = await axios(axiosOptions);
      jobs.push(response.data);
    } catch (error) {
      break;
    }
  }

  return {
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
async function genAxiosOptionsToFetchJobs({ platform }) {
  const baseURL = 'https://socialclub.rockstargames.com/';
  const cookieRegex = /=([^;]*)/;
  const tokenRegex = /value="([a-z0-9_-]*)" \/>/mi;

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

  const RockStarWebSessionId = cookies[0].match(cookieRegex)[1];
  const CSRFToken = cookies[1].match(cookieRegex)[1];
  const prod = cookies[2].match(cookieRegex)[1];

  // 2. Fetch job list page
  axiosOptions.headers.Cookie = serializeCookies({
    UAGD: '1/1/1990',
    UAGC: 1,
    gtav_jobsview: 'cols',
    RockStarWebSessionId,
    CSRFToken,
    prod
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
    category,
    id,
    period,
    skip = 0
  } = options;

  let data = {
    onlyCount: 'false',
    SearchOptSort: 'Liked'
  };

  switch (category) {
    case 'all':
      data.SearchOptPublisher = '';
      break;

    case 'member':
      data.SearchOptPublisher = 'named';
      data.SearchOptNamed = id;
      break;

    case 'crew':
      data.SearchOptPublisher = `crew${id}`;
      break;

    default:
      data.SearchOptPublisher = category;
  }

  if (period) {
    data.SearchOptDate = period;
  }

  if (skip) {
    data.offset = skip * JOBS_PER_RESPONSE;
  }

  return data;
}
