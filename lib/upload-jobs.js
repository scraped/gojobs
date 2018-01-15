const config = require('../config');
const modes = require('../config/modes');
const platforms = require('../config/platforms');
const _ = require('lodash');
const axios = require('axios');
const generateStats = require('./generate-stats');

const Job = require('../models/job');
const JobRaw = require('../models/job-raw');
const User = require('../models/user');
const Crew = require('../models/crew');

module.exports = uploadJobs;

async function uploadJobs() {
  let jobs = await JobRaw.find();

  if (!jobs) {
    throw new Error('Nothing to upload');
  }

  let uploadedJobs = await Promise.all(
    jobs.map(job => uploadJob(job).catch(err => err))
  );

  let errors = 0;

  uploadedJobs.forEach(job => {
    if (job instanceof Error) errors++;
  });

  return { errors };
}

async function uploadJob(job) {
  let newJob = generateJobBasicObj(job);

  if (!newJob) {
    throw new Error(`This job doesn't match the requirements.`);
  }

  let { jobId } = job;

  job = job.job;

  let username = job.Metadata.nickname;

  let userInfo = {
    username,
    updated: new Date()
  }

  let crewUrl = job.Metadata.crewurl;

  if (crewUrl) {
    crewUrl = crewUrl.split('/')[2];

    let crew = await Crew.findOne({ crewUrl });
    let crewId = '';

    if (crew) {
      crewId = crew._id;
    } else {
      let crewInfo = await fetchCrewInfo(crewUrl);
      let { crewId, name, avatar } = crewInfo;
      let tag = job.Metadata.crewtag;
      let color = job.Metadata.crewcolor.split('#')[1];

      crew = await Crew.findOneAndUpdate(
        { crewUrl },
        { crewId, name, avatar, crewUrl, tag, color, dates: { updated: new Date() } },
        config.mongo.standardUpdateOptions
      );

    }

    userInfo.crew = crewId;
    newJob.crew = crewId;
  }

  let user = await User.findOneAndUpdate(
    { username },
    userInfo,
    config.mongo.standardUpdateOptions
  );

  newJob.author = user._id;

  let jobUploaded = await Job.findOneAndUpdate(
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

async function fetchCrewInfo(crewUrl) {
  let link = `https://socialclub.rockstargames.com/crew/${crewUrl}`;

  let result = await axios.get(link);

  if (!result) {
    throw new Error('Cannot fetch crew info');
  }

  let response = result.data;

  let idAndAvatarMatch = response.match(/crews\/sc\/(\d+)\/(\d+)\/publish\//);
  let nameMatch = response.match(/\\"crewname\\":\\"([\w -]+)\\"/);

  return {
    crewId: idAndAvatarMatch[2],
    name: nameMatch[1],
    avatar: idAndAvatarMatch[1]
  }
}

// Returns 0, if index wasn't found
function getPlatform(platform) {
  const index = _.findIndex(platforms, p => p.name === platform);

  return 1 + index;
}

function getCategory(type, mode) {
  let gameType = 0,
    gameMode = 0;

  if (type === 'FreeMission') {
    if (mode === 'Adversary Mode' || mode === 'Versus Mission') {
      type = 'Mission';
    } else {
      type = mode;
    }
  }

  gameType = 1 + _.findIndex(modes, t => t.name === type);
  gameMode = 1 + _.findIndex(modes[gameType - 1].modes, m => m.name === mode);

  return { gameType, gameMode };
}

function generateJobBasicObj(job) {
  const { jobId, jobCurrId } = job;

  job = job.job;

  const { name, desc } = job.Metadata,
    platform = getPlatform(job.Metadata.plat),
    image = job.Metadata.thumbnail,
    { type, mode } = job.Metadata.data.mission.gen,
    { gameType, gameMode } = getCategory(type, mode),
    maxpl = job.Metadata.data.mission.gen.num,
    stats = generateStats(job),
    ver = job.Metadata.ver,
    updated = job.Metadata.cdate,
    fetch = new Date();

  if (!stats || !platform) return;

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
