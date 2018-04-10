const config = require('../../config');
const axios = require('axios');
const _ = require('lodash');
const { queue } = require('../kue');
const RawJob = require('../../models/raw-job');

const JOBS_PER_RESPONSE = 20,
  JOBS_LIMIT = 1000;

/**
 * Fetches jobs from RGSC site & save them in DB.
 * @param {object} options  options:
 * @param {string} options.by       members, member, crew, rockstar,
 * rstarverified (default: members)
 * @param {string} options.username username if 'by' is 'members'
 * @param {number} options.crewId   crewId if 'by' is 'crew'
 * @param {string} options.platform pc, ps4, xbox (default: pc)
 * @param {string} options.period   today, last7, lastMonth
 * (default: not specified)
 * @param {number} options.limit    jobs limit (default: JOBS_LIMIT constant)
 * @param {number} options.skip     how many jobs to skip (default: 0)
 * @returns {undefined}
 */
exports.fetchAndSave = ({
  by = 'members',
  username,
  crewId,
  platform = 'pc',
  limit = JOBS_LIMIT,
  period,
  skip = 0
}) => {

  limit = _.clamp(limit, JOBS_PER_RESPONSE, JOBS_LIMIT);

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
 * Jue 'fetch' job callback.
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

  queue.create('save', { jobs, numberFetched });

  queue.process('save', saveJobsKueCallback);
}

/**
 * Jue 'save' job callback.
 * @param {object} job Kue job params
 * @param {function} done invoke when the job is done
 * @returns {undefined}
 */
async function saveJobsKueCallback(job, done) {
  const { jobs, numberFetched } = job;

  console.log(`Saving ${numberFetched} jobs`);

  const saved = await saveAllRgscJobs(jobs);

  done();

  console.log(`Saving RGSC jobs is over (${saved}/${numberFetched})`);
}

/**
 * Saves RGSC jobs to the DB.
 * @param {array} jobs Array or RGSC jobs object.
 * @returns {Promise<number>} number of successfully saved jobs
 */
async function saveAllRgscJobs(jobs) {
  let jobsToSave = [];

  jobs.forEach(job => {
    jobsToSave.push(saveRgscJob(job));
  });

  let jobsToSaveNumber = jobsToSave.length,
    jobsToSaveSuccess = jobsToSaveNumber;

  await Promise.all(
    jobsToSave.map(jobToSave => jobToSave.catch(err => {
      jobsToSaveSuccess--;
      return err;
    }))
  );

  return jobsToSaveSuccess;
}


/**
 * Saves a single RGSC job to the DB.
 * @param {object} job RGSC job object
 * @returns {undefined}
 */
async function saveRgscJob(job) {
  const jobId = job.Content.Metadata.RootContentId,
    jobCurrId = job.MissionId,
    version = job.Content.Metadata.ver;

  const existedRawJob = await RawJob.findOne({ jobId });

  if (existedRawJob && existedRawJob.version === version) {
    return;
  }

  const newRawJob = {
    jobId,
    jobCurrId,
    job: job.Content,
    version,
    fetched: new Date()
  };

  await RawJob.findOneAndUpdate(
    { jobId },
    newRawJob,
    config.mongo.standardUpdateOptions
  );
}

/**
 * Fetches all jobs from RGSC site based on the options object
 * @param {object} options see fetchAndSave function.
 * @returns {Promise<object>} fulfilled promise returns object
 * {jobs[], number, numberFetched}
 * jobs[] is an array that can contain RGSC responses and/or errors.
 */
async function fetchAllRgscJobs(options) {
  const { limit, skip } = options;

  let axiosOptions = await genAxiosOptionsToFetchJobs(options);

  axiosOptions.data = genQuery(options);

  const jobsFirstBunch = (await axios(axiosOptions)).data;

  const number = Math.min(limit, jobsFirstBunch.Total),
    iterationsAmount = Math.ceil(number / JOBS_PER_RESPONSE);

  let requests = [],
    responses = [],
    jobs = jobsFirstBunch.Missions;

  // NOTE that we have already fetched the first bunch of jobs,
  // therefore we start with i = 1
  for (let i = 1; i < iterationsAmount; i++) {
    const currSkip = skip + i * JOBS_PER_RESPONSE;
    axiosOptions.data = genQuery(Object.assign(options, { skip: currSkip }));
    requests.push(axios(axiosOptions));
  }

  responses = await Promise.all(
    requests.map(request => request.catch(err => err))
  );

  responses.forEach(response => {
    if (response instanceof Error) {
      console.log(`Failed to fetch jobs from RGSC: error ${response.code}`);
    } else {
      response.data.Missions.forEach(jobs.push);
    }
  });

  return {
    jobs,
    number,
    numberFetched: jobs.length
  };
}

/**
 * Generates axios 'options' object for fetching jobs from RGSC site.
 * @param {object} options see fetchAndSave function.
 * @returns {Promise<object>} axios 'options' object.
 */
async function genAxiosOptionsToFetchJobs(options) {
  const baseUrl = 'https://socialclub.rockstargames.com/',
    jobsPageUrl = `/games/gtav`,
    cookieRegex = /=([^;]*)/,
    tokenRegex = /value="([a-z0-9_-]*)" \/>/mi;

  const { platform } = options;

  let axiosOptions = {
    baseUrl,
    headers: {
      'Accept-Language': 'en-US,en',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    }
  };

  // 1. Fetch main page & parse cookies

  const mainPage = await axios(axiosOptions);

  const cookies = mainPage.headers['set-cookie'];

  try {
    cookies.RSWSID = cookies[0].match(cookieRegex)[1];
    cookies.CSRFToken = cookies[1].match(cookieRegex)[1];
    cookies.prod = cookies[2].match(cookieRegex)[1];
  } catch (e) {
    throw new Error('Cannot parse cookies');
  }

  // 2. Fetch jobs list page

  axiosOptions.url = `${jobsPageUrl}/${platform}/jobs/`;
  axiosOptions.headers.Cookie = [
    'UAGD=1/1/1990',
    'UAGC=1',
    'gtav_jobsview=cols',
    `CSRFToken=${cookies.CSRFToken}`,
    `prod=${cookies.prod}`,
    `RockStarWebSessionId=${cookies.RSWSID};`
  ].join('; ');

  const jobsListPage = (await axios(axiosOptions)).data;

  const rqvrfTokenMatch = jobsListPage.match(tokenRegex);

  if (!rqvrfTokenMatch) {
    throw new Error('Cannot parse token');
  }

  // 3. Fetch first bunch of jobs

  axiosOptions.url = `${jobsPageUrl}/ajax/search`;
  axiosOptions.method = 'post';
  axiosOptions.headers.RequestVerificationToken = rqvrfTokenMatch[1];

  return axiosOptions;
}

function genQuery(options) {
  const {
    by,
    username,
    crewId,
    period,
    skip
  } = options;

  let data = {
    onlyCount: 'false',
    offset: skip,
    SearchOptSort: 'Liked'
  };

  switch (by) {
    case 'member':
      data.SearchOptPublisher = 'named';
      data.SearchOptNamed = username;
      break;

    case 'crew':
      data.SearchOptPublisher = `crew${crewId}`;
      break;

    default:
      data.SearchOptPublisher = by;
  }

  if (period) {
    data.SearchOptDate = period;
  }

  return data;
}
