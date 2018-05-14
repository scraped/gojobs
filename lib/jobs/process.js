const config = require('../../config');
const slugify = require('slug');
const {
  isNameBad,
  secondaryVehicles,
  getScTypeAndModeId,
  pitlaneAvailability,
  getBackground,
  secCheckpointsExist
} = require('./process-helpers');
const { generateStats } = require('./stats');
const { getCrewDocument } = require('../crew');

const Job = require('../../models/job');
const JobDetails = require('../../models/job-details');
const RawJob = require('../../models/raw-job');
const User = require('../../models/user');

module.exports = {
  processAllJobs
};

async function processAllJobs() {
  const LIMIT = 1000;

  let result = [];
  let rawJobs = [];

  try {
    rawJobs = await RawJob
      .find({
        extended: true,
        // uploaded: false
      })
      .limit(LIMIT);
  } catch (error) {
    console.log(`processAllJobs error: ${error.message}`);
    return { result };
  }

  console.log(`Processing ${rawJobs.length} jobs`);

  const jobsToProcessPromises = rawJobs.map(rawJob => {
    const { differ } = rawJob;
    const processingPromise = differ
      ? processJob({ rawJob })
      : updateJobStats({ rawJob });
    return processingPromise.catch(err => err);
  });

  const processResults = await Promise.all(jobsToProcessPromises);

  result = processResults.map((success, i) => {
    const { jobId } = rawJobs[i];
    return { jobId, success };
  });

  return result;
}

async function updateJobStats({ rawJob }) {
  const { jobId } = rawJob;
  const rgscJob = rawJob.job;

  const stats = generateStats({ rgscJob });

  if (!stats) {
    return false;
  }

  try {
    await Job.findOneAndUpdate(
      { jobId },
      { stats },
      config.mongo.standardUpdateOptions
    );

    await RawJob.findOneAndUpdate(
      { jobId },
      { uploaded: true },
      config.mongo.standardUpdateOptions
    );

    return true;
  } catch (error) {
    console.log(`updateJobStats error: ${error.message}`);
    return false;
  }
}

/**
 * Transforms & uploads a single rawjob.
 * @param {object} rawJob rawjob object.
 * @returns {Promise<boolean>} if processing was successful
 */
async function processJob({ rawJob }) {
  const { jobId, uploaded, extended } = rawJob;
  const rgscJob = rawJob.job;

  if (!(extended && !uploaded)) {
    return false;
  }

  let jobBasic = genBasicJobObj({ rawJob });

  if (!jobBasic) {
    return false;
  }

  const { author } = jobBasic;
  const { crewurl } = rgscJob.Metadata;

  let crewDoc = null;

  // Crew
  if (crewurl) {
    const slug = crewurl.split('/')[2];
    try {
      crewDoc = await getCrewDocument({ slug });
    } catch {}
  }

  // User
  if (author) {
    let newUserDoc = { username: author };

    if (crewDoc) {
      newUserDoc.crew = crewDoc._id;
    }

    try {
      await User.findOneAndUpdate(
        { username: author },
        newUserDoc,
        config.mongo.standardUpdateOptions
      );
    } catch {}
  }

  try {
    const jobExtended = await genExtendedJobObj({ rgscJob });

    const jobDetails = await JobDetails.findOneAndUpdate(
      { jobId },
      jobExtended,
      config.mongo.standardUpdateOptions
    );

    jobBasic = jobDetails._id;

    await Job.findOneAndUpdate(
      { jobId },
      jobBasic,
      config.mongo.standardUpdateOptions
    );

    await RawJob.findOneAndUpdate(
      { jobId },
      { uploaded: true },
      config.mongo.standardUpdateOptions
    );

    return true;
  } catch (error) {
    console.log(`processJob error: ${error.message}`);
    return false;
  }
}

/**
 * Generates "basic" job according to the "Job" model
 * @param {string} jobId job ID
 * @param {string} jobCurrId current job ID
 * @param {object} rawJob raw job object
 * @returns {object|undefined} generated object or undefined if the job cannot
 * be uploaded
 */
function genBasicJobObj({ rawJob }) {
  const { jobId, jobCurrId } = rawJob;

  const rgscJob = rawJob.job;

  const {
    name,
    ver,
    nickname,
    cat,
    originalCreatorName,
    pdate,
    cdate,
  } = rgscJob.Metadata;

  const image = rgscJob.Metadata.thumbnail;
  const maxPl = rgscJob.Metadata.data.mission.gen.num;
  const minPl = rgscJob.Metadata.data.mission.gen.num;
  const platformName = rgscJob.Metadata.plat;
  const scUpdated = pdate || cdate;
  const scTypeAndModeId = getScTypeAndModeId({ rgscJob });
  const stats = generateStats({ rgscJob });
  const badName = isNameBad({ rgscJob });
  const slug = slugify(name).toLowerCase();

  if (!stats || badName || !slug) {
    return;
  }

  let job = {
    jobId,
    jobCurrId,
    name,
    slug,
    image,
    maxPl,
    scTypeAndModeId,
    stats,
    ver,
    scUpdated,
    tags: []
  };

  if (minPl > 1) {
    job.minPl = minPl;
  }

  // 1. Check category
  if (cat === 'rstar') {
    job.rockstar = true;
  } else if (cat === 'verif') {
    job.rockstar = true;
    job.author = originalCreatorName;
  } else {
    job.author = nickname;
    job.platformName = platformName;
  }

  // 2. Add tags
  if (pitlaneAvailability({ rgscJob })) {
    job.tags.push('pitlane');
  }

  // 3. If this is the first version
  if (ver === 1) {
    job.scAdded = scUpdated;
  }

  return job;
}

/**
 * Generates "extended" job according to the "JobDetails" model
 * @param {string} jobId job ID
 * @param {object} rawJob raw job object
 * @returns {object} generated object
 */
async function genExtendedJobObj({ rawJob }) {
  const { jobId } = rawJob;
  const rgscJob = rawJob.job;

  const { desc } = rgscJob.Metadata;
  const { tnum } = rgscJob.Metadata.data.mission.gen;
  const raceInfo = rgscJob.Metadata.data.mission.race;

  let specific = {};

  // 1. Number of teams
  if (tnum > 1) {
    specific.teams = tnum;
  }

  // 2. Race-specific info
  if (raceInfo) {
    const { lap, chp, rdis, ivm, chl, sndchk, cptfrm } = raceInfo;

    specific.race = {
      laps: lap,
      chp,
      dist: rdis,
      chpLocs: chl
    };

    if (ivm) {
      specific.race.defVeh = ivm;
    }

    if (sndchk && secCheckpointsExist(sndchk)) {
      specific.race.chpSecLocs = sndchk;
    }

    if (cptfrm) {
      const trfVeh = secondaryVehicles(raceInfo);
      if (trfVeh.length) {
        specific.race.trfVeh = trfVeh;
      }
    }
  }

  let jobExtendedObject = {
    jobId,
    desc,
    specific
  };

  // 3. Background
  const background = await getBackground({ rgscJob });

  if (background) {
    jobExtendedObject.background = background;
  }

  return jobExtendedObject;
}
