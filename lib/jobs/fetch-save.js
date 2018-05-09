const chalk = require('chalk');
const _ = require('lodash');
const { queue } = require('../kue');
const { fetchBunches } = require('./fetch');
const { saveRegularJobs } = require('./save');
const redisClient = require('../redis');

const RawJob = require('../../models/raw-job');
const FetchStats = require('../../models/fetch-stats');

module.exports = {
  fetchBunchesAndSave
};

const JOBS_DEFAULT = 50,
  JOBS_LIMIT = 100;

/**
 * Fetches jobs from RGSC site (as bunches, a single bunch contains up to 20
 * jobs) & saves them to RawJob collection. Note we can't get job object with
 * complete information from here (only first item will be such).
 * Utilizes Kue to handle long operations.
 * @param {object} options          options:
 * @param {string} options.category [required] "all", "user", "crew",
 * "rockstar", "rockstarverified" (default: not specified - all jobs)
 * @param {string} options.id       username or crew id or job id if applicable
 * @param {string} options.platform [required] "pc", "ps4", "xboxone"
 * @param {string} options.period   "today", "last7", "lastMonth"
 * (default: any time)
 * @param {number} options.bLimit   Bunches limit (default: JOBS_LIMIT constant)
 * @param {number} options.skip     how many jobs to skip (default: not
 * specified => auto skip)
 * @param {boolean} options.resetSkip resets how many jobs we should skip
 * in this case (default: false)
 * @returns {undefined}
 */
async function fetchBunchesAndSave(options) {
  const {
    category,
    id,
    platform,
    period,
    bLimit
  } = options;

  const categories = ['all', 'user', 'crew', 'rockstar', 'rockstarverified'];
  const platforms = ['pc', 'ps4', 'xb1'];

  if (!platforms.includes(platform) || !categories.includes(category)) {
    throw new Error('Platform is required and must be correct')
  }

  const skip = await jobsToSkip(options);

  const limit = bLimit
    ? _.clamp(bLimit, 1, JOBS_LIMIT)
    : JOBS_DEFAULT;

  const fetchOptions = {
    category,
    id,
    platform,
    period,
    limit,
    skip
  };

  const { total, jobs } = await fetchBunches(fetchOptions);

  await saveRegularJobs(jobs);
}

async function jobsToSkip(options) {
  const { category, id } = options;

  let skip = 0;

  let params = {};

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

  const statistics = await FetchStats.find(params);

  if (statistics) {
    skip = statistics.skip;
  } else {
    const fetchStatistics = new FetchStats(
      Object.assign(params, { platform, period })
    );

    await fetchStatistics.save();
  }

  return skip;
}
