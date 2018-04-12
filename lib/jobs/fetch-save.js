const chalk = require('chalk');
const _ = require('lodash');
const { queue } = require('../kue');
const { fetchAllRgscJobs, JOBS_PER_RESPONSE } = require('./fetch');
const { saveAllRgscJobs } = require('./save');
const redisClient = require('../redis');

const JOBS_LIMIT = 1000;

exports.fetchAndSave = fetchAndSave;

/**
 * Fetches jobs from RGSC site & saves them in DB.
 * Utilizes Kue to handle long operations.
 * @param {object} options            options:
 * @param {string} options.by         members, member, crew, rockstar,
 * rstarverified (default: members)
 * @param {string} options.username   username if 'by' is 'members'
 * @param {number} options.crewId     crewId if 'by' is 'crew'
 * @param {string} options.platform   pc, ps4, xbox (default: pc)
 * @param {string} options.period     today, last7, lastMonth
 * (default: not specified)
 * @param {number} options.limit      jobs limit (default: JOBS_LIMIT constant)
 * @param {number} options.skip       how many jobs to skip
 * (if not specified or NaN, auto skip will be activated)
 * @param {boolean} options.resetSkip resets how many jobs we should skip
 * in this case (default: false)
 * @returns {undefined}
 */
async function fetchAndSave({
  by = 'members',
  username,
  crewId,
  platform = 'pc',
  period = '',
  limit,
  skip,
  resetSkip = false
}) {
  limit = limit
    ? _.clamp(limit, JOBS_PER_RESPONSE, JOBS_LIMIT)
    : JOBS_LIMIT;

  const redisQueryKey = getRedisQueryKey({
    by,
    username,
    crewId,
    platform,
    period
  });

  try {
    if (resetSkip) {
      await redisClient.hsetAsync(redisQueryKey, 'skip', '0');
    } else if (!skip) {
      skip = Number(await redisClient.hgetAsync(redisQueryKey, 'skip'));
    }
  } catch (error) {
    throw error;
  }

  const options = {
    by,
    username,
    crewId,
    platform,
    limit,
    period,
    skip,
    resetSkip
  };

  queue
    .create('save-and-fetch', { options })
    .attempts(3)
    .on('start', () => {
      console.log(chalk.blue('[start] Fetching&saving RGSC jobs with the following options:\n'), options);
    })
    .on('failed attempt', (err, doneAttempts) => {
      console.log(chalk.keyword('orange')(`[failed attempt] Fetching&saving RGSC jobs failed (attempts were made: ${doneAttempts}), message: ${err}`));
    })
    .on('failed', err => {
      console.log(chalk.red(`[failed] Fetching&saving RGSC jobs failed, message: ${err}`));
    })
    .on('complete', result => {
      const { numberFetched, numberSaved, number } = result;
      console.log(chalk.green(`[complete] Fetching&saving RGSC jobs is over (${number} jobs in total, ${numberFetched} fetched, ${numberSaved} saved)`));
    })
    .save();

  queue.process('save-and-fetch', fetchAndSaveJobsKueCallback);
}

/**
 * Kue 'fetch' job callback.
 * @param {object} job Kue job params
 * @param {function} done invoke when the job is done
 * @returns {undefined}
 */
async function fetchAndSaveJobsKueCallback(job, done) {
  const { options } = job.data;
  const { skip } = options;

  try {
    const { jobs, number, numberFetched } = await fetchAllRgscJobs(options);

    const numberSaved = await saveAllRgscJobs(jobs);

    // use auto skip
    if (!skip) {
      const redisQueryKey = getRedisQueryKey(options);
      await Promise.all([
        redisClient.hincrbyAsync(redisQueryKey, 'skip', numberSaved),
        redisClient.hsetAsync(redisQueryKey, 'date', new Date())
      ]);
    }

    done(null, { numberFetched, numberSaved, number });
  } catch (error) {
    done(error);
  }
}

/**
 * Generates redis key based on the options object for fetching RGSC jobs.
 * @param {object} options see fetchAndSave function.
 * @returns {string} redis key.
 */
function getRedisQueryKey(options) {
  const {
    by,
    username,
    crewId,
    platform,
    period
  } = options;

  return 'fetch-save:' + Buffer.from(JSON.stringify({
    by,
    username,
    crewId,
    platform,
    period
  })).toString('base64');
}
