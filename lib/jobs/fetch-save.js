const chalk = require('chalk');
const _ = require('lodash');
const { queue } = require('../kue');
const { fetchAllRgscJobs } = require('./fetch');
const { saveAllRgscJobs } = require('./save');
const redisClient = require('../redis');

const JOBS_DEFAULT = 50,
  JOBS_LIMIT = 100;

exports.fetchAndSave = fetchAndSave;

/**
 * Fetches jobs from RGSC site & saves them in DB.
 * Utilizes Kue to handle long operations.
 * @param {object} options          options:
 * @param {string} options.by       "members", "member", "crew", "job",
 * "rockstar", "rstarverified" (default: "members"; "job" means a single job)
 * @param {string} options.key      username, crew id or job id if
 * "options.by" is "member", "crew" and "job" respectively
 * @param {string} options.platform "pc", "ps4", "xbox" (default: "pc")
 * @param {string} options.period   "today", "last7", "lastMonth"
 * (default: not specified)
 * @param {number} options.limit    jobs limit: [1..JOBS_LIMIT]
 * @param {number} options.skip     how many jobs to skip (default: not
 * specified => auto skip)
 * @param {boolean} options.resetSkip resets how many jobs we should skip
 * in this case (default: false)
 * @returns {undefined}
 */
async function fetchAndSave({
  by = 'members',
  key,
  platform = 'pc',
  period = '',
  limit,
  skip,
  resetSkip = false
}) {
  limit = limit
    ? _.clamp(limit, 1, JOBS_LIMIT)
    : JOBS_DEFAULT;

  const redisKey = getRedisQueryKey({ by, key, platform, period });

  if (by !== 'job') {
    try {
      if (resetSkip) {
        await redisClient.hsetAsync(redisKey, 'skip', '0');
      } else if (!skip) {
        const result = await redisClient.hmgetAsync(redisKey, [
          'date',
          'skip'
        ]);
        const lastFetch = new Date(result[0] || null);
        skip = Number(result[1]);

        // less than 5 minutes
        if (new Date() - lastFetch < 60 * 5) {
          throw new Error('Please wait 5 minutes after the last operation');
        }
      }
    } catch (error) {
      throw error;
    }
  }

  const options = {
    by,
    key,
    platform,
    limit,
    period,
    skip,
    resetSkip
  };

  queue
    .create('save-and-fetch', { options })
    .attempts(3)
    .backoff({ delay: 1000 * 60 * 5, type: 'fixed' })
    .on('start', () => {
      console.log(chalk.blue('[start] Fetching&saving RGSC jobs with the following options: ' + JSON.stringify(options)));
    })
    .on('failed attempt', (err, doneAttempts) => {
      console.log(chalk.keyword('orange')(`[attempt failed] Fetching&saving RGSC jobs failed (attempts were made: ${doneAttempts}), message: ${err}`));
    })
    .on('failed', err => {
      console.log(chalk.red(`[failed] Fetching&saving RGSC jobs failed, message: ${err}`));
    })
    .on('complete', result => {
      const { fetched, saved, totalJobs } = result;
      console.log(chalk.green(`[complete] Fetching&saving RGSC jobs is over (${totalJobs} jobs in total, ${fetched} fetched, ${saved} saved)`));
    })
    .save();

  queue.process('save-and-fetch', fetchAndSaveJobsKueCallback);
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
 * @returns {string} redis key like "member!andreww!pc!today",
 * "crew!5875241!pc!lastMonth", "members!!xbobone!today",...
 */
function getRedisQueryKey(options) {
  const { by, key, platform, period } = options;

  const redisKey = [
    by || '',
    key || '',
    platform || '',
    period || ''
  ].join('!');

  return redisKey;
}
