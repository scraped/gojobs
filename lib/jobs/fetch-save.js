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
 * @param {number} options.skip       how many jobs to skip (default: 0)
 * @param {boolean} options.autoSkip  it uses redis to store how many jobs
 * we should skip in this case (default: true)
 * @param {boolean} options.resetSkip resets how many jobs we should skip
 * in this case (default: false)
 * @returns {undefined}
 */
async function fetchAndSave({
  by = 'members',
  username,
  crewId,
  platform = 'pc',
  limit = JOBS_LIMIT,
  period = '',
  skip = 0,
  autoSkip = true,
  resetSkip = false
}) {

  limit = _.clamp(limit, JOBS_PER_RESPONSE, JOBS_LIMIT);

  const redisQueryKey = getRedisQueryKey(options);

  if (resetSkip) {
    await redisClient.hsetAsync(redisQueryKey, 'skip', '0');
  } else if (autoSkip) {
    skip = Number(await redisClient.hgetAsync(redisQueryKey, 'skip'));
  }

  const options = {
    by,
    username,
    crewId,
    platform,
    limit,
    period,
    skip
  };

  queue.create('fetch', options);

  queue.process('fetch', fetchJobsKueCallback);
}

/**
 * Kue 'fetch' job callback.
 * @param {object} job Kue job params
 * @param {function} done invoke when the job is done
 * @returns {undefined}
 */
async function fetchJobsKueCallback(job, done) {
  const { options } = job;

  console.log('Fetch RGSC jobs with the following options:\n', options);

  const { jobs, number, numberFetched } = await fetchAllRgscJobs(options);

  done();

  console.log(`Fetching RGSC jobs is over (${numberFetched}/${number})`);

  if (numberFetched === 0) {
    return;
  }

  queue.create('save', { options, jobs, numberFetched });

  queue.process('save', saveJobsKueCallback);
}

/**
 * Kue 'save' job callback.
 * @param {object} job Kue job params
 * @param {function} done invoke when the job is done
 * @returns {undefined}
 */
async function saveJobsKueCallback(job, done) {
  const { options, jobs, numberFetched } = job;
  const { autoSkip } = options;

  console.log(`Saving ${numberFetched} jobs`);

  const savedNumber = await saveAllRgscJobs(jobs);

  if (autoSkip) {
    const redisQueryKey = getRedisQueryKey(options);
    await redisClient.hincrbyAsync(redisQueryKey, 'skip', savedNumber);
  }

  done();

  console.log(`Saving RGSC jobs is over (${savedNumber}/${numberFetched})`);
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

  return JSON.stringify({
    by,
    username,
    crewId,
    platform,
    period
  });
}
