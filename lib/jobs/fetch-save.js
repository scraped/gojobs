const _ = require('lodash');
const chalk = require('chalk');
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
 * @param {object} options          options:
 * @param {boolean} options.bunches whether we should fetch bunches of jobs
 * @param {boolean} options.strict  strict mode (default: true)
 * @param {string} options.category [required] "all", "user", "crew",
 * "rockstar", "rockstarverified"; "job" only if "bunches" is not true
 * @param {string} options.id       [required for some categories]
 * username/crew ID/job ID
 * @param {string} options.platform [makes sense only if bunches is true
 * & required for non-rockstar jobs] "pc", "ps4", "xboxone"
 * @param {string} options.period   [makes sense only if bunches is true]
 * "today", "last7", "lastMonth" (default: any time)
 * @param {number} options.reqLimit requests limit (default: REQUESTS_LIMIT)
 * @returns {undefined}
 */
async function fetchJobsAndSave(options) {
  const {
    bunches,
    category,
    id,
    platform,
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
    throw new Error('ID is not specified');
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
    ? fetchBunches({ ...params, ...(await fetchBunchesParams(options)) })
    : fetchJobObjects(params);

  console.log(chalk.blue(`Fetching the following jobs: ${JSON.stringify(params)}`));

  const { fetchResults, total, skip, fetchDate } = await fetchJobsPromise;

  const { saveResults } = await saveJobs({ fetchResults, extended: !bunches });

  console.log(chalk.green(`${fetchResults.length} jobs fetched and ${saveResults.filter(r => r.success).length} saved: ${JSON.stringify(params)}`));

  if (fetchResults.length
    && category !== 'job'
    && !bunches && actualReqLimit === REQUESTS_LIMIT) {
    setTimeout(fetchJobsAndSave, 1000 * 60 * 7, options);
    console.log(chalk.yellow(`fetchJobsAndSave will be invoked in 7 minutes with the following options: ${JSON.stringify(options)}`));
  }

  if (bunches) {
    await fetchBunchesParams(options, { total, skip, fetchDate });
  }

  return {
    saveResults
  };
}

async function fetchBunchesParams(options, fetchResults) {
  const { category, id, platform, period } = options;

  let params = {
    platform
  };

  if (period) {
    params.period = period;
  }

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

  const statistics = await FetchStats.findOne(params);

  if (!fetchResults) {
    if (!statistics) {
      return {};
    }
    const { lastFetch, skip, total } = statistics;
    return { lastFetch, skip, total };
  }

  let {
    skip: skipNew,
    total: totalNew,
    fetchDate: lastFetch
  } = fetchResults;

  if (statistics) {
    const { skip: skipOld, total: totalOld, firstFetch } = statistics;

    skipNew += skipOld;

    if (skipNew > totalOld) {
      skipNew = totalOld;
    }

    if (!firstFetch) {
      params.firstFetch = lastFetch;
    }
  } else {
    params.firstFetch = lastFetch;
    params.total = totalNew;
    params.first
  }

  params.skip = skipNew;
  params.lastFetch = lastFetch;

  if (statistics) {
    statistics.set(params);
  }

  await (statistics || new FetchStats(params)).save();
}
