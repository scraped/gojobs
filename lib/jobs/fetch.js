const config = require('../../config');
const axios = require('axios');
const _ = require('lodash/number');
const RawJob = require('../../models/raw-job');

/**
 * Fetches jobs from RGSC site & save them in DB.
 * @param {object}  options          options:
 * @param {string}  options.by       members, member, crew, rockstar,
 * rstarverified (default: members)
 * @param {mixed}   options.id       username or crew id for 'by' field
 * @param {string}  options.platform pc, ps4, xbox (default: pc)
 * @param {string}  options.period   <empty>, today, last7, lastMonth
 * (default: empty)
 * @param {number}  options.limit    jobs limit (default: 20)
 * @param {number}  options.skip     how many jobs to skip (default: 0)
 * @returns {undefined}
 */
exports.fetchAndSaveJobs = async options => {
  const {
    platform = 'pc',
    limit,
    by = 'members',
    id,
    period,
    skip = 0
  } = options;

  console.log('Starting fetch & save RGSC jobs, params:');
  console.log(options);
  console.log();

  const { jobs, number, fetched } = await fetchRgscJobs({
    platform, limit, by, id, period, skip
  });

  console.log(`Fetching RGSC jobs over (${fetched}/${number})`);

  if (fetched === 0) return;

  let jobsToSave = [];

  jobs.forEach(job => {
    jobsToSave.push(saveRgscJob(job));
  });

  let jobsToSaveNumber = jobsToSave.length,
    jobsToSaveSuccess = jobsToSaveNumber;

  console.log(`Saving ${jobsToSaveNumber} jobs`);

  await Promise.all(
    jobsToSave.map(jobToSave => jobToSave.catch(err => {
      jobsToSaveSuccess--;
      return err;
    }))
  );

  console.log(`Saving RGSC jobs over (${jobsToSaveSuccess}/${jobsToSaveNumber})`);
}

async function saveRgscJob(job) {
  const jobId = job.Content.Metadata.RootContentId,
    jobCurrId = job.MissionId,
    version = job.Content.Metadata.ver;

  const existedRawJob = await RawJob.findOne({ jobId });

  if (existedRawJob && existedRawJob.version === version) {
    console.clear();
    console.log(`Job ${jobId} already exists`);
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

  console.clear();
  console.log(`Job ${jobId} saved`);
}

/**
 * Fetches jobs from RGSC site.
 * @param {object} options see fetchAndUpload function.
 * @returns {Promise} fulfilled promise returns object {jobs[], amount, fetched}
 * jobs[] is an array that can contain RGSC responses and/or errors.
 */
async function fetchRgscJobs(options) {
  const JOBS_PER_RESPONSE = 20,
    JOBS_LIMIT = 2000,
    baseURL = 'https://socialclub.rockstargames.com/',
    jobsPage = `/games/gtav`,
    cookieRegex = /=([^;]*)/,
    tokenRegex = /value="([a-z0-9_-]*)" \/>/mi;

  let {
    platform,
    limit,
    by,
    id,
    period,
    skip
  } = options;

  limit = _.clamp(
    Number(limit) || JOBS_LIMIT,
    JOBS_PER_RESPONSE,
    JOBS_LIMIT
  );

  let axiosOptions = {
    baseURL,
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

  axiosOptions.url = `${jobsPage}/${platform}/jobs/`;
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

  axiosOptions.url = `${jobsPage}/ajax/search`;
  axiosOptions.method = 'post';
  axiosOptions.headers.RequestVerificationToken = rqvrfTokenMatch[1];
  axiosOptions.data = genQuery({ by, id, period, skip });

  const jobsFirstBlock = (await axios(axiosOptions)).data;

  // 4. Fetch remaining jobs

  const number = Math.min(limit, jobsFirstBlock.Total),
    iterationsAmount = Math.ceil(number / JOBS_PER_RESPONSE);

  let requests = [],
    responses = [],
    jobs = [];

  for (let i = 0; i < iterationsAmount; i++) {
    const currSkip = skip + i * JOBS_PER_RESPONSE;
    axiosOptions.data = genQuery({ by, id, period, skip: currSkip });
    requests.push(axios(axiosOptions));
  }

  responses = await Promise.all(
    requests.map(request => request.catch(err => err))
  );

  responses.forEach(response => {
    if (response instanceof Error) {
      console.log(`Failed to fetch jobs from RGSC: error ${response.code}`);
    } else {
      response.data.Missions.forEach(job => {
        jobs.push(job);
      });
    }
  });

  return {
    jobs,
    number,
    fetched: jobs.length
  };
}

function genQuery({ by, id, period, skip }) {
  let data = {
    onlyCount: 'false',
    offset: skip,
    SearchOptSort: 'Liked'
  };

  switch (by) {
    case 'member':
      data.SearchOptPublisher = 'named';
      data.SearchOptNamed = id;
      break;

    case 'crew':
      data.SearchOptPublisher = `crew${id}`;
      break;

    default:
      data.SearchOptPublisher = by;
  }

  if (period) {
    data.SearchOptDate = period;
  }

  return data;
}
