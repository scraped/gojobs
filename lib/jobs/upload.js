const config = require('../config');
const modes = require('../config/modes');
const platforms = require('../config/platforms');
const _ = require('lodash');
const generateStats = require('./generate-stats');
const updateCrewInfo = require('../crew');

const Job = require('../../models/job');
const RawJob = require('../../models/raw-job');
const User = require('../../models/user');
const Crew = require('../../models/crew');

module.exports = upload;

/**
 * Transforms & uploads rawjobs to the actual jobs collection.
 * @param {object} options options:
 * @param {number} options.limit jobs limit (default: 5000)
 * @returns {Promise<object>} fulfilled promise result is an object
 * {amount<number>, errors<number>}
 */
async function upload({ limit = 5000 }) {
  const jobs = await RawJob.find().limit(limit);

  if (!jobs) {
    throw new Error('There are no jobs to upload.');
  }

  const uploadedJobs = await Promise.all(
    jobs.map(job => {
      if (!job.job) return Promise.resolve();
      return uploadJob(job).catch(err => err);
    })
  );

  const amount = uploadedJobs.length;
  let errors = 0;

  uploadedJobs.forEach(job => {
    if (job instanceof Error) {
      errors++;
    }
  });

  return { amount, errors };
}

/**
 * Transforms & uploads a single rawjob.
 * @param {object} rawJob rawjob object.
 * @returns {Promise} empty promise.
 */
async function uploadJob(rawJob) {
  const { jobId } = rawJob;

  let job = generateJobBasicObj(rawJob);

  if (!job) {
    await RawJob.findOneAndUpdate(
      { jobId },
      { job: {} },
      config.mongo.standardUpdateOptions
    );
  }

  rawJob = rawJob.job;

  const username = rawJob.Metadata.nickname,
    crewSlug = rawJob.Metadata.crewurl;

  let newUserDoc = { username };

  if (crewSlug) {
    const crewDocId = (await updateCrewInfo({
      slug: crewSlug.split('/')[2]
    }))._id;

    newUserDoc.crew = crewDocId;
    job.crew = crewDocId;
  }

  await User.findOneAndUpdate(
    { username },
    newUserDoc,
    config.mongo.standardUpdateOptions
  );

  job.author = username;

  await Job.findOneAndUpdate(
    { jobId },
    job,
    config.mongo.standardUpdateOptions
  );

  await RawJob.findOneAndUpdate(
    { jobId },
    { uploaded: true },
    config.mongo.standardUpdateOptions
  );

  console.log(`Job ${jobId} updated.`);
}

function getPlatform(platform) {
  platform = platform.toLowerCase();
  const platformId = 1 + _.findIndex(platforms, p => p.shortname === platform);

  return platformId;
}

function getCategory({ type, mode }) {
  const gameType = 1 + _.findIndex(modes, t => t.name === type);
  const gameMode = 1 + _.findIndex(modes[gameType - 1].modes, m => m.name === mode);

  return { gameType, gameMode };
}

function generateJobBasicObj(job) {
  const { jobId, jobCurrId } = job;
  const { fetch } = job.dates;

  job = job.job;

  const { name, desc } = job.Metadata,
    platform = getPlatform(job.Metadata.plat),
    image = job.Metadata.thumbnail,
    maxpl = job.Metadata.data.mission.gen.num,
    stats = generateStats(job),
    ver = job.Metadata.ver,
    updated = job.Metadata.cdate;
  let { type, mode } = job.Metadata.data.mission.gen;

  if (mode === 'Adversary Mode'
    || mode === 'Versus Mission'
    || mode === 'Parachuting'
    || mode === 'Survival'
    || !stats
    || !platform) {
      return;
    }

  if (mode === 'Last Team Standing') {
    type = mode;
  }

  const { gameType, gameMode } = getCategory({ type, mode });

  let newJob = {
    jobId,
    jobCurrId,
    name,
    desc,
    platform,
    image,
    job: { gameType, gameMode, maxpl },
    stats,
    ver,
    dates: { fetch, updated }
  };

  if (ver === 1) {
    newJob.dates.added = updated;
  }

  return newJob;
}
