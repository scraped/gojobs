const _ = require('lodash');
const {
  fetchBunches,
  fetchJobObjects
} = require('./fetch');
const { saveJobs } = require('./save');

const FetchStats = require('../../models/fetch-stats');

module.exports = {
  fetchJobsBunchesAndSave,
  fetchJobsAndSave
};

const JOBS_BUNCHES_LIMIT = 100;

/**
 * Fetches jobs from RGSC site (as bunches, a single bunch contains up to 20
 * jobs) & saves them to RawJob collection. Note we can't get job object with
 * complete information from here (only first item will be such).
 * Utilizes Kue to handle long operations.
 * @param {object} options          options:
 * @param {string} options.category [required] "all", "user", "crew",
 * "rockstar", "rockstarverified" (default: not specified - all jobs)
 * @param {string} options.id       username or crew id or job id if applicable
 * @param {string} options.platform [required for non-rockstar jobs]
 * "pc", "ps4", "xboxone"
 * @param {string} options.period   "today", "last7", "lastMonth"
 * (default: any time)
 * @param {number} options.bLimit   Bunches limit (default: JOBS_LIMIT constant)
 * @param {number} options.skip     how many jobs to skip (default: not
 * specified => auto skip)
 * @param {boolean} options.resetSkip resets how many jobs we should skip
 * in this case (default: false)
 * @returns {undefined}
 */
async function fetchJobsBunchesAndSave(options) {
  const {
    category,
    id,
    platform,
    period,
    bLimit
  } = options;

  const categories = ['all', 'user', 'crew', 'rockstar', 'rockstarverified'];
  const platforms = ['pc', 'ps4', 'xboxone'];

  if (!categories.includes(category)) {
    throw new Error('Category is required and must be correct')
  }

  if ((category === 'user' || category === 'crew')
    && !id) {
    throw new Error('ID was not specified');
  }

  if (category !== 'rockstar'
    && category !== 'rockstarverified'
    && !platforms.includes(platform)) {
    throw new Error('Platform is required and must be correct')
  }

  const skip = await jobsToSkip(options);

  const limit = bLimit
    ? _.clamp(bLimit, 1, JOBS_BUNCHES_LIMIT)
    : JOBS_BUNCHES_LIMIT;

  const fetchOptions = {
    category,
    id,
    platform,
    period,
    limit,
    skip
  };

  const { total, jobs } = await fetchBunches(fetchOptions);

  const saveResult = await saveJobs({ jobs });

  const success = saveResult
    .filter(result => result.success)
    .length;

  await jobsToSkip(options, success, total);

  return {
    total,
    result: saveResult
  };
}

async function fetchJobsAndSave({ jobId }) {
  const { total, jobs } = await fetchJobObjects({ jobId });

  const { failures } = await saveJobs({ jobs, extended: true });

  const jobIds = jobs.map(job => job.Content.Metadata.RootContentId);

  return {
    total,
    failures,
    jobs: jobIds
  };
}

async function jobsToSkip(options, success, total) {
  const { category, id, platform, period } = options;

  let skip = 0;

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

  const statistics = await FetchStats.findOne(params);

  if (success && total) {
    skip = success;

    if (statistics) {
      skip += statistics.skip;
    }

    await FetchStats.findOneAndUpdate(
      params,
      { ...params, skip, total },
      { upsert: true }
    );
  } else if (statistics) {
    skip = statistics.skip;
  }

  return skip;
}
