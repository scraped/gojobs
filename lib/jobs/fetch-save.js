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
 * @param {string} options.category "all", "user", "crew", "job", "rockstar",
 * "rockstarverified" (default: "all")
 * @param {string} options.key      username, crew ID or job ID if
 * "options.category" is "user", "crew" and "job" respectively
 * @param {string} options.platform "pc", "ps4", "xb1" (default: "pc")
 * @param {string} options.period   "today", "last7", "last30"
 * (default: not specified - means all time)
 * @param {number} options.bLimit   Bunches limit (default: JOBS_LIMIT constant)
 * @param {number} options.skip     how many jobs to skip (default: not
 * specified => auto skip)
 * @param {boolean} options.resetSkip resets how many jobs we should skip
 * in this case (default: false)
 * @returns {undefined}
 */
async function fetchBunchesAndSave({
  category,
  username,
  crewId,
  platform = 'pc',
  period = '',
  bLimit,
  skip = 0
}) {
  const limit = bLimit
    ? _.clamp(bLimit, 1, JOBS_LIMIT)
    : JOBS_DEFAULT;

  if (username || crewId || category) {
    let params = null;

    if (username) params = { username };
    if (crewId) params = { crewId };
    if (category) params = { category };

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

  const options = {
    category,
    username,
    crewId,
    platform,
    period,
    limit,
    skip
  };

  // const redisKey = getRedisQueryKey({ by, key, platform, period });

  // if (by !== 'job') {
  //   try {
  //     if (resetSkip) {
  //       await redisClient.hsetAsync(redisKey, 'skip', '0');
  //     } else if (!skip) {
  //       const result = await redisClient.hmgetAsync(redisKey, [
  //         'date',
  //         'skip'
  //       ]);
  //       const lastFetch = new Date(result[0] || null);
  //       skip = Number(result[1]);

  //       // less than 5 minutes
  //       if (new Date() - lastFetch < 60 * 5) {
  //         throw new Error('Please wait 5 minutes after the last operation');
  //       }
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // const options = {
  //   by,
  //   key,
  //   platform,
  //   limit,
  //   period,
  //   skip,
  //   resetSkip
  // };

  // queue
  //   .create('save-and-fetch', { options })
  //   .attempts(3)
  //   .backoff({ delay: 1000 * 60 * 5, type: 'fixed' })
  //   .on('start', () => {
  //     console.log(chalk.blue('[start] Fetching&saving RGSC jobs with the following options: ' + JSON.stringify(options)));
  //   })
  //   .on('failed attempt', (err, doneAttempts) => {
  //     console.log(chalk.keyword('orange')(`[attempt failed] Fetching&saving RGSC jobs failed (attempts were made: ${doneAttempts}), message: ${err}`));
  //   })
  //   .on('failed', err => {
  //     console.log(chalk.red(`[failed] Fetching&saving RGSC jobs failed, message: ${err}`));
  //   })
  //   .on('complete', result => {
  //     const { fetched, saved, totalJobs } = result;
  //     console.log(chalk.green(`[complete] Fetching&saving RGSC jobs is over (${totalJobs} jobs in total, ${fetched} fetched, ${saved} saved)`));
  //   })
  //   .save();

  // queue.process('save-and-fetch', fetchAndSaveJobsKueCallback);
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
