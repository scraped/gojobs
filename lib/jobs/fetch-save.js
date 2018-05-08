const chalk = require('chalk');
const _ = require('lodash');
const { queue } = require('../kue');
const { fetchAllRgscJobs } = require('./fetch');
const { saveAllRgscJobs } = require('./save');
const redisClient = require('../redis');

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
 * @param {string} options.category "user", "crew", "job", "rockstar",
 * "rockstarverified" (default: not specified - all jobs)
 * @param {string} options.id       username or crew id or job id if applicable
 * @param {string} options.platform [required] "pc", "ps4", "xb1"
 * @param {string} options.period   "today", "last7", "last30"
 * (default: any time)
 * @param {number} options.bLimit   Bunches limit (default: JOBS_LIMIT constant)
 * @param {number} options.skip     how many jobs to skip (default: not
 * specified => auto skip)
 * @param {boolean} options.resetSkip resets how many jobs we should skip
 * in this case (default: false)
 * @returns {undefined}
 */
async function fetchBunchesAndSave({
  category,
  id,
  platform,
  period,
  bLimit,
  skip = 0
}) {
  const availPlatforms = ['pc', 'ps4', 'xb1'];

  if (!availPlatforms.includes(platform)) {
    throw new Error('Platform is required and must be correct')
  }

  if (category) {
    let params = {};
    let needsGettingStats = false;

    switch (category) {
      case 'rockstar':
      case 'rockstarverified':
        params.category = category;

      case 'user': // eslint-disable-line
        params.username = id;

      case 'crew': // eslint-disable-line
        params.crewId = id;
        needsGettingStats = true;
        break;

      default:
    }

    if (needsGettingStats) {
      const statistics = await FetchStats.find(params);

      if (statistics) {
        skip = statistics.skip;
      } else {
        const fetchStatistics = new FetchStats(
          Object.assign(params, { platform, period })
        );

        await fetchStatistics.save();
      }
    }
  }

  const limit = bLimit
    ? _.clamp(bLimit, 1, JOBS_LIMIT)
    : JOBS_DEFAULT;

  const options = {
    category,
    id,
    platform,
    period,
    limit,
    skip
  };

  await fetchBunches(options);
}

/**
 * Kue 'fetch' job callback.
 * @param {object} kueJob Kue job object
 * @param {function} done invoke when the job is done
 * @returns {undefined}
 */
async function fetchAndSaveJobsKueCallback(kueJob, done) {
  const { options } = kueJob.data;
  const { by, skip } = options;

  try {
    const { jobs, totalJobs } = await fetchAllRgscJobs(options, kueJob);

    const { saved } = await saveAllRgscJobs(jobs);

    // use auto skip
    if (by !== 'job' && !skip) {
      const redisQueryKey = getRedisQueryKey(options);
      await Promise.all([
        redisClient.hincrbyAsync(redisQueryKey, 'skip', saved),
        redisClient.hsetAsync(redisQueryKey, 'date', new Date())
      ]);
    }

    done(null, { fetched: jobs.length, saved, totalJobs });
  } catch (error) {
    done(error);
  }
}

/**
 * Generates redis key based on the options object for fetching RGSC jobs.
 * @param {object} options see fetchAndSave function.
 * @returns {string} redis key like "fetch:Base64(member!andreww!pc!today)",
 * "fetch:Base64(crew!5875241!pc!lastMonth)",
 * "fetch:Base64(members!!xbobone!today)",...
 */
function getRedisQueryKey(options) {
  const { by, key, platform, period } = options;

  const redisKey = 'fetch:' + Buffer.from([
    by || '',
    key || '',
    platform || '',
    period || ''
  ].join('!')).toString('base64');

  return redisKey;
}
