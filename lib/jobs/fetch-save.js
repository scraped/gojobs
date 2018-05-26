const _ = require('lodash');
const {
  fetchBunches,
  fetchJobObjects
} = require('./fetch');
const { saveJobs } = require('./save');

const FetchStats = require('../../models/fetch-stats');

module.exports = {
  fetchJobsAndSave
};

const REQUESTS_LIMIT = 200;

/**
 * Fetches jobs from RGSC site (as bunches, a single bunch contains up to 20
 * jobs) & saves them to RawJob collection. Note we can't get job object with
 * complete information from here (only first item will be such).
 * Utilizes Kue to handle long operations.
 * @param {object} options          options:
 * @param {boolean} options.bunches whether we should fetch bunches of jobs
 * @param {string} options.category [required] "all", "user", "crew",
 * "rockstar", "rockstarverified"; "job" only if "bunches" is not true
 * @param {string} options.id       [required for some categories]
 * username/crew ID/job ID
 * @param {string} options.platform [makes sense only if bunches is true
 * & required for non-rockstar jobs] "pc", "ps4", "xboxone"
 * @param {string} options.period   [makes sense only if bunches is true] "today", "last7", "lastMonth"
 * (default: any time)
 * @param {number} options.reqLimit requests limit (default: REQUESTS_LIMIT)
 * @returns {undefined}
 */
async function fetchJobsAndSave(options) {
  const {
    bunches,
    category,
    id,
    platform,
    period,
    reqLimit
  } = options;

  const possibleCategories = [
    'all',
    'job',
    'user',
    'crew',
    'rockstar',
    'rockstarverified'
  ];

  const possiblePlatforms = ['pc', 'ps4', 'xboxone'];

  if (!possibleCategories.includes(category)
    || bunches && category === 'job') {
    throw new Error('Category is required and must be correct');
  }

  if ((category === 'user' || category === 'crew' || category === 'job')
    && !id) {
    throw new Error('Id is not specified');
  }

  if (category !== 'rockstar'
    && category !== 'rockstarverified'
    && !possiblePlatforms.includes(platform)) {
    throw new Error('Platform is required and must be correct');
  }

  const actualReqLimit = reqLimit
    ? _.clamp(reqLimit, 1, REQUESTS_LIMIT)
    : REQUESTS_LIMIT;

  const params = {
    ...options,
    reqLimit: actualReqLimit
  };

  const fetchJobsPromise = bunches
    ? fetchBunches({ ...params, skip: await jobsToSkip(params) })
    : fetchJobObjects(params);

  console.log(`Fetching the following jobs: ${JSON.stringify(params)}`);

  const { fetchResults, total } = await fetchJobsPromise;

  const { saveResults } = await saveJobs({ fetchResults, extended: !bunches });

  if (bunches) {
    await jobsToSkip(params, fetchResults.length, total);
  }

  return { saveResults };
}

async function jobsToSkip(options, skipNew, total) {
  const { category, id, platform, period } = options;

  let params = {
    platform,
    period
  };

  switch (category) {
    case 'user':
      params.username = id;
      break;

    case 'crew':
      params.crewId = id;
      break;

    default:
      params.category = category;
  }

  let skip = 0;

  const statistics = await FetchStats.findOne(params);

  if (skipNew && total) {
    skip = skipNew;

    if (statistics) {
      skip += statistics.skip;
    }

    if (skip > total) {
      skip = total;
    }

    if (statistics) {
      statistics.set({ skip, total });
    }

    await (statistics || new FetchStats({ ...params, skip })).save();
  } else if (statistics) {
    skip = statistics.skip;
  }

  return skip;
}
