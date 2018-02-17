const config = require('../../config');
const { generateStats } = require('./generate-stats');
const { addCrew } = require('../crew');

const Job = require('../../models/job');
const JobDetails = require('../../models/job-details');
const RawJob = require('../../models/raw-job');
const User = require('../../models/user');

/**
 * Transforms & uploads rawjobs to the actual jobs collection.
 * @param {object} options options:
 * @param {number} options.limit jobs limit
 * @returns {object} object {amount<number>, errors<number>}
 */
exports.uploadRawJobs = async function({ limit = 5 }) {
  const rawJobs = await RawJob.find().limit(limit);

  console.log(`UPLOADING ${rawJobs.length} JOBS`);

  await Promise.all(
    rawJobs.map(rawJob => {
      if (!rawJob.job) {
        return Promise.resolve();
      }
      return uploadRawJob({ rawJob }).catch(err => err);
    })
  );

  console.log('UPLOADING COMPLETE');
}

/**
 * Transforms & uploads a single rawjob.
 * @param {object} rawJob rawjob object.
 * @returns {undefined}
 */
async function uploadRawJob({ rawJob }) {
  const { jobId, jobCurrId } = rawJob;

  rawJob = rawJob.job;

  console.log(`Rawjob ${jobId}: uploading`);
  console.log(`Rawjob ${jobId}: uploading2`);

  const job = genBasicJobObj({ jobId, jobCurrId, rawJob });
  let jobDetails = genExtendedJobObj({ jobId, rawJob });

  if (!job) {
    await RawJob.findOneAndUpdate(
      { jobId },
      { job: {} },
      config.mongo.standardUpdateOptions
    );
    console.log(`Rawjob ${jobId} is not good`);
    return;
  }

  const username = rawJob.Metadata.nickname,
    crewSlug = rawJob.Metadata.crewurl;

  let newUserDoc = { username };

  if (crewSlug) {
    const crewDocId = (await addCrew({
      slug: crewSlug.split('/')[2]
    }))._id;

    newUserDoc.crew = crewDocId;
    jobDetails.crew = crewDocId;
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

  await JobDetails.findOneAndUpdate(
    { jobId },
    jobDetails,
    config.mongo.standardUpdateOptions
  );

  await RawJob.findOneAndUpdate(
    { jobId },
    { uploaded: true },
    config.mongo.standardUpdateOptions
  );

  console.log(`Rawjob ${jobId} uploaded`);
}

function genBasicJobObj({ jobId, jobCurrId, rawJob }) {
  const { name, ver } = rawJob.Metadata,
    slug = name,
    imageUrl = rawJob.Metadata.thumbnail,
    maxPl = rawJob.Metadata.data.mission.gen.num,
    platformName = rawJob.Metadata.plat,
    { scTypeName, scModeName } = getScTypeAndModeName({ rawJob }),
    stats = generateStats({ rawJob }),
    scUpdated = rawJob.Metadata.cdate;

  if (!stats) {
    return;
  }

  let job = {
    jobId,
    jobCurrId,
    name,
    slug,
    imageUrl,
    maxPl,
    platformName,
    scTypeName,
    scModeName,
    stats,
    scUpdated
  };

  if (job.Content.Metadata.cat === 'rstar') {
    job.rockstar = true;
  } else {
    job.author = job.Metadata.nickname;
  }

  if (ver === 1) {
    job.scAdded = scUpdated;
  }

  return job;
}

function genExtendedJobObj({ jobId, rawJob }) {
  let specific = {};

  const { desc } = rawJob.Metadata,
    { tnum, racetype } = rawJob.Metadata.data.mission.gen,
    { chp, lap, rdis } = rawJob.Metadata.data.mission.race;

  if (tnum > 1) {
    specific.teamNum = tnum;
  }

  // for races
  if (chp) {
    specific.race = {
      chp,
      dist: rdis
    }

    if (racetype === 'Point to Point') {
      specific.race.p2p = true;
    } else {
      specific.race.laps = lap;
    }
  }

  const job = {
    jobId,
    desc,
    specific
  };

  return job;
}

function getScTypeAndModeName({ rawJob }) {
  const { type, mode } = rawJob.Metadata.data.mission.gen,
    { name } = rawJob.Metadata;

  let scTypeName = type,
    scModeName = mode;

  if (type === 'FreeMission') {
    if (mode === 'Last Team Standing') {
      scTypeName = 'Last Team Standing';
    } else {
      scTypeName = 'Mission';
    }
  } else if (type === 'Survival') {
    scTypeName = 'Mission';
    scModeName = 'Survival';
  } else if (type === 'Capture') {
    const captureMode = name.split(' - ')[0];
    if (captureMode === 'Raid'
      || captureMode === 'Contend'
      || captureMode === 'GTA'
      || captureMode === 'Hold') {
      scModeName = captureMode;
    }
  }

  return {
    scTypeName,
    scModeName
  }
}
