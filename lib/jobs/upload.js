const config = require('../config');
const modes = require('../config/modes');
const platforms = require('../config/platforms');
const _ = require('lodash');
const axios = require('axios');
const generateStats = require('./generate-stats');

const Job = require('../../models/job');
const JobRaw = require('../../models/job-raw');
const User = require('../../models/user');
const Crew = require('../../models/crew');

module.exports = upload;

/**
 * Transforms & uploads rawjobs to the actual jobs collection.
 * @param {object} options options:
 * @param {number} options.limit jobs limit (default: 10000)
 * @returns {Promise<object>} fulfilled promise result is an object
 * {amount<number>, errors<number>}
 */
async function upload({ limit = 10000 }) {
  const jobs = await JobRaw.find().limit(limit);

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
 * @param {object} job rawjob object.
 * @returns {Promise} empty promise.
 */
async function uploadJob(job) {
  let newJob = generateJobBasicObj(job);

  if (!newJob) {
    throw new Error(`This job doesn't match the requirements.`);
  }

  const { jobId } = job;

  job = job.job;

  const username = job.Metadata.nickname;
  let userInfo = {
    username,
    updated: new Date()
  };

  let crewSlug = job.Metadata.crewurl;

  if (crewSlug) {
    crewSlug = crewSlug.split('/')[2];

    let crew = await Crew.findOne({ crewSlug });
    let crewDocId;

    if (crew) {
      crewDocId = crew._id;
    } else {
      const { crewId, name, avatar, rockstar } = await fetchCrewInfo(crewSlug),
        tag = job.Metadata.crewtag,
        color = job.Metadata.crewcolor.split('#')[1];

      const crewDoc = {
        crewId,
        crewSlug,
        name,
        tag,
        color,
        avatar,
        rockstar,
        dates: { updated: new Date() }
      };

      const crewDocResult = await Crew.findOneAndUpdate(
        { crewId, crewSlug },
        crewDoc,
        config.mongo.standardUpdateOptions
      );

      crewDocId = crewDocResult._id;
    }

    userInfo.crew = crewDocId;
    newJob.crew = crewDocId;
  }

  const user = await User.findOneAndUpdate(
    { username },
    userInfo,
    config.mongo.standardUpdateOptions
  );

  newJob.author = user._id;

  const jobUploaded = await Job.findOneAndUpdate(
    { jobId },
    newJob,
    config.mongo.standardUpdateOptions
  );

  console.log(`${jobId} : ${jobUploaded ? 'updated' : 'added'}`);

  await JobRaw.findOneAndUpdate(
    { jobId },
    { uploaded: true },
    config.mongo.standardUpdateOptions
  );
}

async function fetchCrewInfo(crewSlug) {
  const link = `https://socialclub.rockstargames.com/crew/${crewSlug}`;

  let response;

  try {
    response = (await axios.get(link)).data;
  } catch (e) {
    let errorMessage = `Cannot fetch crew (${crewSlug})`;
    if (e.response) {
      errorMessage += `: code ${e.response.status}`;
    }
    throw new Error(errorMessage)
  }

  const idMatch = response.match(/\\"CrewId\\":(\d+),/),
    nameMatch = response.match(/\\"crewname\\":\\"([\w -]+)\\"/),
    avatarMatch = response.match(/crews\/sc\/(\d+)\/(\d+)\/publish\//),
    descMatch = response.match(/\\"status\\":\\"[x]+\\"/);

  if (!idMatch || !nameMatch) {
    throw new Error(`Cannot parse crew info, crewSlug: ${crewSlug}`)
  }

  let crewInfo = {
    crewId: idMatch[1],
    name: nameMatch[1],
    rockstar: !avatarMatch
  }

  if (avatarMatch) crewInfo.avatar = avatarMatch[1];
  if (descMatch) crewInfo.desc = descMatch[1];

  return crewInfo;
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
