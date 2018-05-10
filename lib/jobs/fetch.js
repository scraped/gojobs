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
  console.log('Fetch job(s) ' + JSON.stringify(options));

  const { limit } = options;

  let bunchesFetched = 0;
  let total = 0;
  let jobs = [];

  try {
    let { axiosOptions, token } = await genAxiosOptionsToFetchJobs(options);

    axiosOptions.url = '/games/gtav/ajax/search';
    axiosOptions.method = 'post';
    axiosOptions.data = genQuery({ options, token });

    const firstBunch = await axios(axiosOptions);

    if (firstBunch.data.Error) {
      throw new Error('Rgsc job object contains error');
    }

    bunchesFetched++;

    total = firstBunch.data.Total;

    jobs = firstBunch.data.Missions || [];

    let fetchError = false;

    while (!fetchError && bunchesFetched < limit) {
      axiosOptions.data = genQuery({
        options: Object.assign(options, { skip: bunchesFetched }),
        token
      });

      try {
        // eslint-disable-next-line
        const bunch = await axios(axiosOptions);
        if (bunch.data.Error) {
          fetchError = true;
        }
        bunchesFetched++;
        jobs.push(...bunch.data.Missions);
      } catch (error) {
        if (fetchError) {
          throw new Error('Rgsc job object contains error');
        }
        fetchError = true;
      }
    }
  } catch (error) {
    console.log('fetchBunches error: ' + error.message);
  }

  return {
    total,
    jobs
  };
}

async function fetchJobObjects({ jobId }) {
  console.log('Fetch extended job(s) ' + jobId);

  let jobs = [];
  let total = 0;

  let axiosOptions = await genAxiosOptionsToFetchJobs({
    options: { platform: '' }
  });

  axiosOptions.url = '/games/gtav/ajax/mission';
  axiosOptions.method = 'get';
  axiosOptions.data = null;

  if (jobId) {
    total = 1;
    axiosOptions.params = { missionid: jobId };
    try {
      const response = await axios(axiosOptions);
      jobs.push(response.data);
    } catch {}
  } else {
    let needFetch = [];

    try {
      needFetch = await RawJob.find({ extended: false }).limit(10000);

      total = needFetch.length;

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
    } catch {}
  }

  return {
    jobs,
    total
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
  const cookieRegex = /(\w+)=([^;]*)/;
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

  let RockStarWebSessionId = '';
  let CSRFToken = '';
  let prod = '';

  cookies.forEach(cookie => {
    const match = cookie.match(cookieRegex);
    if (match) {
      const name = match[1];
      const value = match[2];
      switch (name) {
        case 'RockStarWebSessionId': RockStarWebSessionId = value; break;
        case 'CSRFToken': CSRFToken = value; break;
        case 'prod': prod = value; break;
      }
    }
  });

  if (!RockStarWebSessionId || !CSRFToken || !prod) {
    throw new Error('Cannot detect all necessary cookies');
  }

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

  return {
    axiosOptions,
    token: requestVerifTokenMatch[1]
  };
}

/**
 * Generates query object to fetch RGSC jobs
 * @param {object} options see fetchAndSave function (fetch-save.js)
 * @returns {object} query object
 */
function genQuery({ options, token }) {
  const {
    category,
    id,
    period,
    skip = 0
  } = options;

  let data = {
    onlyCount: 'false',
    offset: skip * JOBS_PER_RESPONSE,
    SearchOptSort: 'Liked',
    // __RequestVerificationToken: token
  };

  switch (category) {
    case 'all':
      data.SearchOptPublisher = 'members';
      break;

    case 'member':
      data.SearchOptPublisher = 'named';
      data.SearchOptNamed = id;
      break;

    case 'crew':
      data.SearchOptPublisher = `crew${id}`;
      break;

    case 'rockstarverified':
      data.SearchOptPublisher = 'rstarverified';
      break;

    default:
      data.SearchOptPublisher = category;
  }

  if (period) {
    data.SearchOptDate = period;
  }

  return data;
}
