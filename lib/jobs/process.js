const slugify = require('slug');
const _ = require('lodash');

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
  processJobs
};

const PROCESS_DEFAULT_LIMIT = 3000;
const ONE_HOUR = 1000 * 60 * 60 * 1;

async function processJobs({
  any = false,
  limit = PROCESS_DEFAULT_LIMIT
} = {}) {
  limit = _.clamp(limit, 1, PROCESS_DEFAULT_LIMIT);

  let result = [];
  let rawJobs = [];
  let previouslyUploaded = [];

  let query = {
    extended: true,
    // processDate: { $lte: new Date() - ONE_HOUR }
  };

  if (!any) {
    query.processed = false;
  }

  try {
    console.log(`${await RawJob.find(query).count()} need to be processed in total`);

    rawJobs = await RawJob.find(query).limit(limit);

    previouslyUploaded = await Promise.all(
      rawJobs.map(rawJob => {
        const { jobId } = rawJob;
        return Job.findOne({ jobId }).catch(err => err);
      })
    );
  } catch (error) {
    console.log(`processAllJobs error: ${error.message}`);
    return { result: [] };
  }

  console.log(`Processing ${rawJobs.length} jobs`);

  const jobsToProcessPromises = rawJobs.map((rawJob, i) => {
    const oldJob = previouslyUploaded[i];

    if (oldJob instanceof Error) {
      return false;
    }

    const differ = !oldJob || oldJob.ver !== rawJob.job.Metadata.ver;

    const processingPromise = differ
      ? processJob({ rawJob, oldJob })
      : processJob({ rawJob, oldJob });

    return processingPromise.catch(err => err);
  });

  const processResults = await Promise.all(jobsToProcessPromises);

  result = processResults.map((success, i) => {
    const { jobId } = rawJobs[i];
    return { jobId, success };
  });

  return result;
}

async function updateJobStats({ rawJob, oldJob }) {
  const { jobId, fetchDate } = rawJob;

  try {
    const oldRawJob = await RawJob.findOne({ jobId });

    const stats = generateStats({ rawJob, oldJob });

    const shouldBeUploaded = Boolean(stats);

    if (shouldBeUploaded) {
      oldJob.set({ stats, fetchDate });
    }

    oldRawJob.set({
      processed: true,
      uploaded: shouldBeUploaded,
      processDate: new Date()
    });

    if (shouldBeUploaded) {
      await oldJob.save();
    }

    await oldRawJob.save();

    return shouldBeUploaded;
  } catch (error) {
    console.log(`updateJobStats error (${jobId}):`, error);
    return false;
  }
}

/**
 * Transforms & uploads a single rawjob.
 * @param {object} rawJob rawjob object.
 * @returns {Promise<boolean>} if processing was successful
 */
async function processJob({ rawJob, oldJob }) {
  const { jobId, job: rgscJob } = rawJob;

  try {
    let {
      newJob: jobBasic,
      rawJobAdditions
    } = genBasicJobObj({ rawJob, oldJob }) || {};

    const oldRawJob = await RawJob.findOne({ jobId });

    oldRawJob.set({
      processed: true,
      processDate: new Date(),
      uploaded: Boolean(jobBasic),
      ...rawJobAdditions
    });

    if (!jobBasic) {
      await oldRawJob.save();
      return false;
    }

    const { author: username } = jobBasic;
    const { crewurl } = rgscJob.Metadata;

    let crewDoc;

    if (crewurl) {
      const slug = crewurl.split('/')[2];
      crewDoc = await getCrewDocument({ slug });
    }

    if (username) {
      const oldUser = await User.findOne({ username });

      let newUserDoc = { username };

      if (crewDoc) {
        newUserDoc.crew = crewDoc._id;
      }

      if (oldUser) {
        oldUser.set(newUserDoc);
      }

      await (oldUser || new User(newUserDoc)).save();
    }

    const jobExtended = await genExtendedJobObj({ rawJob });

    const oldJobDetails = await JobDetails.findOne({ jobId });

    if (oldJobDetails) {
      oldJobDetails.set(jobExtended);
    }

    const newJobDetails = await (
      oldJobDetails || new JobDetails(jobExtended)
    ).save();

    jobBasic.details = newJobDetails._id;

    if (oldJob) {
      oldJob.set(jobBasic);
    } else {
      oldRawJob.set({
        firstUploadDate: new Date()
      });
    }

    await (oldJob || new Job(jobBasic)).save();

    await oldRawJob.save();

    return true;
  } catch (error) {
    console.log(`processJob error (${jobId}):`, error);
    return false;
  }
}

/**
 * Generates "basic" job according to the "Job" model
 * @param {string} jobId job ID
 * @param {string} jobCurrId current job ID
 * @param {object} rawJob raw job object
 * @returns {object|undefined} generated object or undefined if the job
 * cannot be uploaded
 */
function genBasicJobObj({ rawJob, oldJob }) {
  const {
    jobId,
    jobCurrId,
    job: rgscJob,
    fetchDate
  } = rawJob;

  const {
    name,
    ver,
    nickname,
    cat,
    originalCreatorName,
    pdate,
    cdate,
    thumbnail: imageUrl,
    plat: platformName
  } = rgscJob.Metadata;

  const {
    num: maxPl,
    min: minPl
  } = rgscJob.Metadata.data.mission.gen;

  const author = originalCreatorName || nickname;
  const scUpdated = pdate || cdate;
  const scTypeAndModeId = getScTypeAndModeId({ rgscJob });
  const { stats, trendCoeffs } = generateStats({ rawJob, oldJob }) || {};
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
    imageUrl,
    maxPl,
    scTypeAndModeId,
    stats,
    ver,
    scUpdated,
    tags: [],
    fetchDate
  };

  if (author) {
    job.author = author;
  }

  if (minPl > 1) {
    job.minPl = minPl;
  }

  // 1. Check category
  if (cat === 'rstar' || cat === 'verif') {
    job.rockstar = true;
    job.scAdded = scUpdated;
  } else {
    job.platformName = platformName;
  }

  // for example: CtQjYyAnNE27C6cIgGmfeQ
  if (!job.author && !job.rockstar) {
    return;
  }

  // 2. Add tags
  if (pitlaneAvailability({ rgscJob })) {
    job.tags.push('pitlane');
  }

  // 3. If this is the first version of the job
  if (ver === 1) {
    job.scAdded = scUpdated;
  }

  return {
    newJob: job,
    rawJobAdditions: {
      lastCoeffs: trendCoeffs
    }
  };
}

/**
 * Generates "extended" job according to the "JobDetails" model
 * @param {string} jobId job ID
 * @param {object} rawJob raw job object
 * @returns {object} generated object
 */
async function genExtendedJobObj({ rawJob }) {
  const { jobId, job: rgscJob } = rawJob;

  const { desc } = rgscJob.Metadata;

  const {
    tnum: teamsNumber,
    type,
    ivm: defVehicle,
    racetype
  } = rgscJob.Metadata.data.mission.gen;

  const raceInfo = rgscJob.Metadata.data.mission.race;

  let specific = {};

  // 1. Number of teams
  if (teamsNumber > 1) {
    specific.teams = teamsNumber;
  }

  // 2. Race-specific info
  if ((type === 'Race' || type === 'Parachuting') && raceInfo) {
    const {
      lap: lapsNumber,
      chp: checkpointsNumber,
      rdis: dist,
      chl: checkpointsLocations,
      sndchk: secCheckpointsLocations,
      cptfrm: transformCheckpoints
    } = raceInfo;

    specific.race = {
      p2p: !lapsNumber && racetype !== 'Laps',
      chp: checkpointsNumber,
      dist
    };

    if (lapsNumber) {
      specific.race.laps = lapsNumber;
    }

    if (defVehicle) {
      specific.race.defVeh = defVehicle;
    }

    const chpLocsMapper = loc => [loc.x, loc.y];

    if (checkpointsLocations) {
      specific.race.chpLocs = checkpointsLocations.map(chpLocsMapper);
    }

    if (secCheckpointsLocations
      && secCheckpointsExist(secCheckpointsLocations)) {
      specific.race.chpSecLocs = secCheckpointsLocations.map(chpLocsMapper);
    }

    if (transformCheckpoints) {
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
