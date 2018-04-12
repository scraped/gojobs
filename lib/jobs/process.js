const config = require('../../config');
const slugify = require('slug');
const chalk = require('chalk');
const { queue } = require('../kue');
const { generateStats } = require('./generate-stats');
const { getCrewDoc } = require('../crew');

const Job = require('../../models/job');
const JobDetails = require('../../models/job-details');
const RawJob = require('../../models/raw-job');
const User = require('../../models/user');

const DEFAULT_JOB_SLUG = 'job';

exports.processAllJobs = processAllJobs;

/**
 * Transforms & uploads raw jobs to the actual jobs collection.
 * @param {number} limit jobs limit
 * @param {boolean} forceUploadAll re-upload ALL the jobs.
 * WARNING: it can take a lot of time!
 * @returns {Promise<object>} structure: {amount: number, errors: number}
 */
async function processAllJobs({
  limit = 10000,
  forceUploadAll = false
}) {
  const rawJobs = await RawJob.find().limit(limit);

  const toUpload = rawJobs.length;

  console.log(`UPLOADING ${toUpload} JOBS (FORCED = ${forcedUpload})`);

  const uploadedJobs = await Promise.all(
    rawJobs.map(rawJob => {
      if (!rawJob.job) {
        return Promise.resolve();
      }
      return uploadRawJob({ rawJob, forcedUpload }).catch(err => err);
    })
  );

  let uploaded = toUpload;

  uploadedJobs.forEach((job, i) => {
    if (job instanceof Error) {
      console.log(`Failed to upload job ${rawJobs[i].jobId}:`, job);
      uploaded--;
    }
  });

  console.log(`UPLOADED ${uploaded}/${toUpload} JOBS`);
}

/**
 * Transforms & uploads a single rawjob.
 * @param {object} rawJob rawjob object.
 * @param {boolean} forcedUpload forces to upload even already uploaded job
 * @returns {undefined}
 */
async function processJob({ rawJob, forcedUpload }) {
  const { jobId, jobCurrId, uploaded } = rawJob;

  rawJob = rawJob.job;

  console.log(`Rawjob ${jobId}: uploading`);

  if (Object.keys(rawJob).length === 0) {
    console.log(`Rawjob ${jobId} is empty`);
    return;
  } else if (!forcedUpload && uploaded) {
    console.log(`Rawjob ${jobId} already uploaded`);
  }

  let job = genBasicJobObj({ jobId, jobCurrId, rawJob }),
    jobDetails = genExtendedJobObj({ jobId, rawJob });

  if (!job) {
    await RawJob.findOneAndUpdate(
      { jobId },
      { job: {} },
      config.mongo.standardUpdateOptions
    );
    console.log(`Rawjob ${jobId} cannot be uploaded`);
    return;
  }

  const { nickname, crewurl } = rawJob.Metadata;
  let crewDocId;

  if (crewurl) {
    const slug = crewurl.split('/')[2];
    crewDocId = (await getCrewDoc({ slug }))._id;
    jobDetails.crew = crewDocId;
  }

  if (nickname) {
    let newUserDoc = { username: nickname };

    if (crewDocId) newUserDoc.crew = crewDocId;

    await User.findOneAndUpdate(
      { username: nickname },
      newUserDoc,
      config.mongo.standardUpdateOptions
    );
  }

  const jobOld = await Job.findOne({ jobId });
  const jobDetailsOld = await JobDetails.findOne({ jobId });

  if (jobDetailsOld) {
    jobDetails = Object.assign(jobDetailsOld, jobDetails);
  }

  const uploadedJobDetailsDocId = (await new JobDetails(jobDetails).save())._id;
  job.details = uploadedJobDetailsDocId;

  if (jobOld) {
    job = Object.assign(jobOld, job);
  }

  await new Job(job).save();

  await RawJob.findOneAndUpdate(
    { jobId },
    { uploaded: true },
    config.mongo.standardUpdateOptions
  );

  console.clear();
  console.log(`Rawjob ${jobId} uploaded`);
}

function genBasicJobObj({ jobId, jobCurrId, rawJob }) {
  const { name, ver, nickname, cat } = rawJob.Metadata,
    imageUrl = rawJob.Metadata.thumbnail,
    maxPl = rawJob.Metadata.data.mission.gen.num,
    platformName = rawJob.Metadata.plat,
    scTypeAndModeName = getScTypeAndModeName({ rawJob }),
    stats = generateStats({ rawJob }),
    scUpdated = rawJob.Metadata.cdate;

  const slug = slugify(name).toLowerCase() || DEFAULT_JOB_SLUG;

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
    scTypeAndModeName,
    stats,
    ver,
    scUpdated
  };

  if (cat === 'rstar') {
    job.rockstar = true;
  } else {
    job.author = nickname;
    job.platformName = platformName;
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
    raceInfo = rawJob.Metadata.data.mission.race;

  if (tnum > 1) {
    specific.teamNum = tnum;
  }

  // for races
  if (raceInfo) {
    const { chp, lap, rdis } = raceInfo;
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
