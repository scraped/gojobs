const config = require('../config');
const modes = require('../config/modes');
const platforms = require('../config/platforms');
const _ = require('lodash');
const { generateStats } = require('./generate-stats');
const { addCrew } = require('../crew');

const Job = require('../../models/job');
const RawJob = require('../../models/raw-job');
const User = require('../../models/user');
const Crew = require('../../models/crew');

/**
 * Transforms & uploads rawjobs to the actual jobs collection.
 * @param {object} options options:
 * @param {number} options.limit jobs limit (default: 5000)
 * @returns {object} object {amount<number>, errors<number>}
 */
exports.uploadRawJobs = async function ({ limit = 5000 }) {
  const rawJobs = await RawJob.find().limit(limit);

  const uploadedJobs = await Promise.all(
    rawJobs.map(rawJob => {
      if (!rawJobs.job) return Promise.resolve();
      return uploadRawJob({ rawJob }).catch(err => err);
    })
  );

  const amount = uploadedJobs.length;
  let uploaded = amount;

  uploadedJobs.forEach(job => {
    if (job instanceof Error) {
      uploaded--;
    }
  });

  return { amount, uploaded };
}

/**
 * Transforms & uploads a single rawjob.
 * @param {object} rawJob rawjob object.
 * @returns {undefined}
 */
async function uploadRawJob({ rawJob }) {
  const { jobId } = rawJob;

  console.log(`Rawjob ${jobId}: uploading`);

  let job = generateJobBasicObj(rawJob);

  if (!job) {
    await RawJob.findOneAndUpdate(
      { jobId },
      { job: {} },
      config.mongo.standardUpdateOptions
    );
    console.log(`Rawjob ${jobId} is not good`);
    return;
  }

  rawJob = rawJob.job;

  const username = rawJob.Metadata.nickname,
    crewSlug = rawJob.Metadata.crewurl;

  job.author = username;

  let newUserDoc = { username };

  if (crewSlug) {
    const crewDocId = (await addCrew({
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

  console.log(`Rawjob ${jobId} transformed`);
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

function generateJobBasicObj({ rawJob }) {
  const { jobId, jobCurrId, fetched } = rawJob;

  rawJob = rawJob.job;

  const { name, desc } = rawJob.Metadata,
    platform = getPlatform(rawJob.Metadata.plat),
    image = rawJob.Metadata.thumbnail,
    maxpl = rawJob.Metadata.data.mission.gen.num,
    stats = generateStats(rawJob),
    ver = rawJob.Metadata.ver,
    updated = rawJob.Metadata.cdate;
  let { type, mode } = rawJob.Metadata.data.mission.gen;

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
