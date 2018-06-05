const axios = require('axios');
const _ = require('lodash');
const { serializeCookies } = require('../helpers');

const RawJob = require('../../models/raw-job');
const Crew = require('../../models/crew');

module.exports = {
  fetchBunches,
  fetchJobObjects
};

const ONE_DAY = 1000 * 60 * 60 * 24;

async function fetchBunches(options) {
  const { reqLimit, skip } = options;

  let total = 0;
  let fetchResults = [];

  const rgscJobsMapper = job => {
    return {
      jobId: job.Content.Metadata.RootContentId,
      job
    };
  };

  try {
    let bunchesFetched = 0;

    let axiosOptions = {
      ...(await genAxiosOptionsToFetchJobs(options.platform)),
      url: '/games/gtav/ajax/search',
      method: 'post',
      data: genJobBunchesQuery(options)
    };

    const firstBunch = await axios(axiosOptions);

    if (firstBunch.data.Error) {
      throw new Error('Rgsc job object contains error');
    }

    bunchesFetched++;

    total = firstBunch.data.Total;

    fetchResults = firstBunch.data.Missions
      ? firstBunch.data.Missions.map(rgscJobsMapper)
      : [];

    while (bunchesFetched < reqLimit) {
      axiosOptions.data.skip = skip + fetchResults.length;

      console.log('Fetching a bunch of jobs...');

      const bunch = await axios(axiosOptions);

      const {
        Missions: jobsBunch,
        Error: jobObjError
      } = bunch.data;

      if (jobObjError || !jobsBunch.length) {
        break;
      }

      bunchesFetched++;
      fetchResults.push(...jobsBunch.map(rgscJobsMapper));
    }
  } catch (error) {
    console.log('fetchBunches error:', error);
  }

  return {
    total,
    fetchResults
  };
}

/**
 *
 * @param {options} options see fetchJobsAndSave function
 * @returns {array<Object>} object: {jobId: string, job: object|undefined}
 */
async function fetchJobObjects(options) {
  const { reqLimit, category, id, strict = true } = options;

  let fetchResults = [];

  try {
    let axiosOptions = {
      ...(await genAxiosOptionsToFetchJobs()),
      url: '/games/gtav/ajax/mission',
      method: 'get'
    };

    if (category === 'job') {
      // We don't know whether id us permanent or current id
      fetchResults.push({ jobId: id, jobCurrId: id });
    } else {
      let query = {};

      if (strict) {
        query.extended = false;
      }

      switch (category) {
        case 'crew':
          const crewInfo = await Crew.findOne({ crewId: id });

          if (!crewInfo) {
            return { fetchResults: [] };
          }

          query['job.Metadata.crewurl'] = `/crew/${crewInfo.slug}`;
          break;

        case 'user':
          query['job.Metadata.nickname'] = id;
          break;

        case 'rockstar':
          query['job.Metadata.cat'] = 'rstar';
          break;

        case 'rockstarverified':
          query['job.Metadata.cat'] = 'verif';
          break;
      }

      query.$or = [
        {
          'job.stats': { $exists: false },
          fetchDate: { $lte: new Date() - ONE_DAY * 28 }
        },
        {
          'job.stats': { $exists: true },
          fetchDate: { $lte: new Date() - ONE_DAY * 7 }
        }
      ];

      console.log(`${await RawJob.find(query).count()} jobs need to be fetched...`);

      const rawJobsToFetch = await RawJob
        .find(query)
        .sort({ fetchDate: 'asc' })
        .limit(reqLimit);

      fetchResults = rawJobsToFetch.map(rawJob => {
        const { jobId, jobCurrId } = rawJob;
        return { jobId, jobCurrId };
      });
    }

    for (let i = 0; i < fetchResults.length; i++) {
      const { jobId, jobCurrId } = fetchResults[i];

      axiosOptions.params = { missionid: jobCurrId };

      const jobObject = (await axios(axiosOptions)).data;

      if (jobObject && jobObject.MissionId) {
        const {
          latest: latestVersion,
          latestVersionContentId,
          RootContentId
        } = jobObject.Content.Metadata;

        if (latestVersion) {
          fetchResults[i].jobId = RootContentId;
          fetchResults[i].job = jobObject;
          console.log(`${jobId} fetch ok`);
        } else {
          fetchResults[i].jobCurrId = latestVersionContentId;
          i--;
        }
      } else {
        fetchResults[i].removed = true;
        console.log(`${jobId} fetch warn: empty or incorrect object`);
      }
    }
  } catch (error) {
    console.log('fetchJobObjects error:', error)
  }

  return {
    fetchResults
  };
}

/**
 * Generates axios 'options' object for fetching jobs from RGSC site:
 * 1) adds baseURL property
 * 2) adds a proper "Cookie" header
 * 3) adds "RequestVerificationToken" header
 * 4) adds "X-Requested-With: XMLHttpRequest" header
 * 5) adds other necessary headers
 * @param {string} platform the same platform used in fetchBunches
 * (default: pc)
 * @returns {Promise<object>} axios 'options' object.
 */
async function genAxiosOptionsToFetchJobs(platform = 'pc') {
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

  return axiosOptions;
}

/**
 * Generates query object to fetch RGSC jobs
 * @param {object} options see fetchAndSave function (fetch-save.js)
 * @returns {object} query object
 */
function genJobBunchesQuery(options) {
  const {
    category,
    id,
    period,
    skip = 0
  } = options;

  let data = {
    onlyCount: 'false',
    offset: skip,
    SearchOptSort: 'Liked'
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
