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
  const {
    reqLimit,
    platform,
    total: oldTotal,
    skip: oldSkip,
    lastFetch
  } = options;

  let newTotal = oldTotal;
  let newSkip = oldSkip;
  let fetchResults = [];

  try {
    let bunchesFetched = 0;

    let axiosOptions = {
      ...(await genAxiosOptionsToFetchJobs(platform)),
      url: '/games/gtav/ajax/search',
      method: 'post',
      data: genJobBunchesQuery(options)
    };

    const fetchByUpdateDate = axiosOptions.data.SearchOptSort === 'CreatedDate';
    const initialSkip = axiosOptions.data.offset;

    while (bunchesFetched < reqLimit) {
      axiosOptions.data.offset = initialSkip + fetchResults.length;

      console.log(`Fetching the following bunch of jobs: ${JSON.stringify(axiosOptions.data)}`);

      // eslint-disable-next-line
      const bunch = await axios(axiosOptions);

      let {
        Missions: currJobs,
        Error: jobObjError,
        Total: currTotal
      } = bunch.data;

      if (jobObjError || !currJobs || !currJobs.length) {
        const errorMessage = jobObjError && jobObjError.Message
          || '<No error message>';
        console.log(`Error: current bunch of jobs is broken: ${errorMessage}`);
        break;
      }

      const minUpdateDate = Math.min(...currJobs.map(job => {
        const { pdate, cdate } = job.Content.Metadata;
        const date = pdate || cdate;
        return new Date(date);
      }));

      if (fetchByUpdateDate
        && lastFetch
        && minUpdateDate < new Date(lastFetch)) {
        // stop fetching
        bunchesFetched = reqLimit;

        currJobs = currJobs.filter(job => {
          const { pdate, cdate } = job.Content.Metadata;
          const date = pdate || cdate;
          return date >= new Date(lastFetch);
        });
      }

      newTotal = currTotal;

      bunchesFetched++;

      fetchResults.push(...currJobs.map(
        job => ({
          jobId: job.Content.Metadata.RootContentId,
          job
        })
      ));
    }

    newSkip = axiosOptions.data.offset;
  } catch (error) {
    console.log('fetchBunches error:', error);
  }

  return {
    total: newTotal,
    skip: newSkip,
    fetchDate: new Date(),
    fetchResults
  };
}

/**
 *
 * @param {options} options see fetchJobsAndSave function
 * @returns {array<Object>} {jobId: string, jobCurrId: string,
 * job: object, status: string}
 */
async function fetchJobObjects(options) {
  const { reqLimit, category, id, platform, strict = true } = options;

  let fetchResults = [];

  try {
    let axiosOptions = {
      ...(await genAxiosOptionsToFetchJobs()),
      url: '/games/gtav/ajax/mission',
      method: 'get'
    };

    if (category === 'job') {
      // We don't know whether it is permanent or current id
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

        default:
      }

      if (!strict) {
        const sharedQueryFieldsForUserJobs = {
          'job.Metadata.cat': 'none',
          'job.Metadata.plat': new RegExp('^' + platform + '$', 'i')
        }

        query.$or = [
          {
            ...sharedQueryFieldsForUserJobs,
            'job.stats': { $exists: false },
            fetchDate: { $lte: new Date() - ONE_DAY * 28 }
          },
          {
            ...sharedQueryFieldsForUserJobs,
            'job.stats': { $exists: true },
            fetchDate: { $lte: new Date() - ONE_DAY * 7 }
          },
          {
            'job.Metadata.cat': { $ne: 'none' },
            fetchDate: { $lte: new Date() - ONE_DAY }
          }
        ];
      }

      console.log(`${await RawJob.find(query).count()} jobs need to be fetched for ${platform}`);

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
      const fetchResult = fetchResults[i];
      const { jobId } = fetchResult;

      // eslint-disable-next-line
      await fetchJobObject({ fetchResult, axiosOptions });

      if (fetchResult.status === 'NOT_LATEST') {
        console.log(`${jobId} fetched, but wasn't the latest`);
        // eslint-disable-next-line
        await fetchJobObject({ fetchResult, axiosOptions });
      }

      console.log(`${jobId} fetched`);
    }
  } catch (error) {
    console.log('fetchJobObjects error:', error)
  }

  return {
    fetchResults
  };
}

/**
 * Attempts to fetch an arbitrary job
 * @param {object} options.fetchResult fetch result structure
 * @param {object} options.axiosOptions axios options
 * @return {Promise<undefined>} the function only modifies fetchResult
 */
async function fetchJobObject({ fetchResult, axiosOptions }) {
  const { jobCurrId } = fetchResult;

  axiosOptions.params = { missionid: jobCurrId };

  let jobObject = null;

  try {
    jobObject = (await axios(axiosOptions)).data;
  } catch (error) {
    fetchResult.status = `REQUEST_ERROR`;
    return;
  }

  fetchResult.status = '';

  if (!jobObject || !jobObject.MissionId) {
    fetchResult.status = 'NOT_AVAILABLE';
    return;
  }

  const {
    latest: latestVersion,
    latestVersionContentId,
    RootContentId,
    cat: category
  } = jobObject.Content.Metadata;

  if (!latestVersion) {
    fetchResult.jobCurrId = latestVersionContentId;
    fetchResult.status = 'NOT_LATEST';
    return;
  }

  // No "stats" object and non-rockstar job
  if (!jobObject.Content.stats && category === 'none') {
    fetchResult.status = 'NO_STATS_PROPERTY';
  }

  fetchResult.jobId = RootContentId;
  fetchResult.job = jobObject;
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
        default:
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
    skip: oldSkip = 0,
    total: oldTotal = 0,
  } = options;

  let data = {
    onlyCount: 'false'
  };

  if (oldSkip >= oldTotal) {
    data.SearchOptSort = 'CreatedDate';
    data.offset = 0;
  } else {
    data.SearchOptSort = 'Liked';
    data.offset = oldSkip;
  }

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
