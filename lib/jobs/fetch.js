const axios = require('axios');
const _ = require('lodash');
const { serializeCookies } = require('../helpers');

const RawJob = require('../../models/raw-job');

module.exports = {
  fetchBunches,
  fetchJobObjects
};

async function fetchBunches(options) {
  console.log(`Fetching the following jobs: ${JSON.stringify(options)}`);

  const { limit, skip } = options;

  let bunchesFetched = 0;
  let total = 0;
  let jobs = [];

  const rgscJobsMapper = job => {
    jobId: job.Content.Metadata.RootContentId,
  }

  try {
    let { axiosOptions, token } = await genAxiosOptionsToFetchJobs(options);

    Object.assign(axiosOptions, {
      url: '/games/gtav/ajax/search',
      method: 'post',
      data: genQuery({ options, token })
    });

    const firstBunch = await axios(axiosOptions);

    if (firstBunch.data.Error) {
      throw new Error('Rgsc job object contains error');
    }

    bunchesFetched++;

    total = firstBunch.data.Total;

    jobs = firstBunch.data.Missions.map() || [];

    let noMoreJobs = false;

    while (!noMoreJobs && bunchesFetched < limit) {
      axiosOptions.data = genQuery({
        options: { ...options, skip: skip + jobs.length },
        token
      });

      console.log('Fetching a bunch of jobs...');

      const bunch = await axios(axiosOptions);

      if (bunch.data.Error) {
        throw new Error('Rgsc job object contains error');
      }

      const { Missions: jobsBunch } = bunch.data;

      if (jobsBunch.length) {
        bunchesFetched++;
        jobs.push(...bunch.data.Missions);
      } else {
        noMoreJobs = true;
      }
    }
  } catch (error) {
    console.log('fetchBunches error:', error);
  }

  return {
    total,
    jobs
  };
}

/**
 *
 * @param {options} options {jobId: string, limit: number, proxy: string}
 * @returns {array<Object>} object: {jobId: string, job: object|undefined}
 */
async function fetchJobObjects({ jobId, limit, proxy }) {
  const DEFAULT_LIMIT = 150;

  const actualLimit = limit
    ? _.clamp(limit, 1, DEFAULT_LIMIT)
    : DEFAULT_LIMIT;

  console.log(`Fetch extended job(s) (${actualLimit} is the limit)`);

  let jobs = [];
  let axiosOptions = {};

  try {
    axiosOptions = Object.assign(
      (await genAxiosOptionsToFetchJobs({ proxy })).axiosOptions,
      {
        url: '/games/gtav/ajax/mission',
        method: 'get'
      }
    );

    if (jobId) {
      axiosOptions.params = { missionid: jobId };
        const jobObject = (await axios(axiosOptions)).data;

        if (jobObject && jobObject.MissionId) {
          jobs.push({ jobId, job: jobObject });
        } else {
          jobs.push({ jobId });
        }
    } else {
      const needFetch = await RawJob
        .find({ extended: false })
        .sort({ fetchDate: 'asc' })
        .limit(actualLimit);

      for (let i = 0; i < needFetch.length; i++) {
        const { jobId, jobCurrId } = needFetch[i];

        axiosOptions.params = { missionid: jobCurrId };

        console.log(`${jobId} fetching...`);

        const jobObject = (await axios(axiosOptions)).data;

        if (jobObject && jobObject.MissionId) {
          jobs.push({ jobId, job: jobObject });
        } else {
          jobs.push({ jobId });
        }
      }
    }
  } catch (error) {
    console.log(`fetchJobObjects error: ${error.message}`)
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
 * @param {object} options
 * @param {string} options.platform the same platform used in fetchBunches
 * @param {string} options.proxy proxy server like 127.0.0.1:8888
 * @returns {Promise<object>} axios 'options' object.
 */
async function genAxiosOptionsToFetchJobs({ platform = '', proxy }) {
  const baseURL = 'https://socialclub.rockstargames.com/';
  const cookieRegex = /(\w+)=([^;]*)/;
  const tokenRegex = /value="([a-z0-9_-]*)" \/>/mi;
  const ipv4PlusPortRegex = /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\:([0-9]{1,5})/;

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

  // 0. Proxy
  if (proxy && ipv4PlusPortRegex.test(proxy)) {
    const [ host, port ] = proxy.split(':');
    console.log(`Using proxy server ${proxy}`);

    axiosOptions.proxy = {
      host,
      port: Number(port)
    };
  }

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
    offset: skip,
    SearchOptSort: 'Liked',
    // __RequestVerificationToken: token
  };

  switch (category) {
    case 'all':
      data.SearchOptPublisher = 'members';
      break;

    case 'user':
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
