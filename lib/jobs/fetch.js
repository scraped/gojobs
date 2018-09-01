const axios = require('axios');
const clamp = require('lodash/clamp');
const {platforms} = require('../../config/static');

const {Crew, RawJob} = require('../../models');

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

////////////////////////////////////////////////////////////////////////////

const {RgscHttpClient} = require('./http');

async function fetchJob({jobId}) {
  const http = new RgscHttpClient();

  await http.getCredentials();

  const response = await http.fetchJob(jobId);

  const rawJob = response.data;

  if (!rawJob || !rawJob.MissionId) {
    throw new Error(`No data was received for job ${jobId}`);
  }

  return rawJob;
}

async function fetchJobBunch({
    platform = 'pc',
    searchParams
  }) {
  if (!searchParams) {
    throw new Error('Platform and search parameters must be specified');
  }

  const http = new RgscHttpClient(platform);

  await http.getCredentials();

  // How do we distinguish between platforms? Solely by cookies
  const response = await http.fetcher({
    url: '/games/gtav/ajax/search',
    method: 'post',
    data: searchParams
  });

  const jobBunch = response.data;

  const {
    Missions: jobs,
    Error: error
  } = jobBunch;

  if (error || !jobs) {
    throw new Error(`Error, got the following response: ${JSON.stringify(jobBunch)} for this search params: ${JSON.stringify(searchParams)}`);
  }

  return jobBunch;
}

async function fetchJobBunches({
  category = 'rockstar',
  platform = 'all',
  id,
  offset = 0
}) {
  const possibleCategories = [
    // 'all',
    'user',
    'crew',
    'rockstar',
    'rockstarverified'
  ];

  const possiblePlatforms = [
    'all',
    ...Object.keys(platforms)
  ];

  if (!possibleCategories.includes(category)) {
    throw new Error(`Category '${category}' does not exist`);
  }

  if ((category === 'user' || category === 'crew')
    && !id) {
    throw new Error(`${category} Username or crew slug must be specified`);
  }

  if (category !== 'rockstar'
    && category !== 'rockstarverified'
    && !possiblePlatforms.includes(platform)) {
    throw new Error(`Platform '${platform}' does not exist`);
  }

  const searchParams = genFetchJobBunchesData({category, id, offset});

  const bunch = await fetchJobBunch({
    platform,
    searchParams
  });

  return bunch;
}

function genFetchJobBunchesData({
  category,
  id,
  offset = 0
}) {
  let query = {
    onlyCount: 'false',
    SearchOptSort: 'CreatedDate',
    offset
  };

  switch (category) {
    case 'all':
      query.SearchOptPublisher = 'members';
      break;

    case 'user':
      query.SearchOptPublisher = 'named';
      query.SearchOptNamed = id;
      break;

    case 'crew':
      query.SearchOptPublisher = `crew${id}`;
      break;

    case 'rockstarverified':
      query.SearchOptPublisher = 'rstarverified';
      break;

    default:
      query.SearchOptPublisher = category;
  }

  return query;
}

module.exports = {
  fetchJob,
  fetchJobBunch,
  fetchJobBunches,

  fetchBunches,
  fetchJobObjects
};
