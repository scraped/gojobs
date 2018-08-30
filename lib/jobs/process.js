const slugify = require('slug');
const {generateJobStats} = require('./stats');

const {
  isNameBad,
  secondaryVehicles,
  getScTypeAndMode,
  pitlaneAvailability,
  getBackground,
  secCheckpointsExist,
  getVehiclesClasses
} = require('./process-helpers');

const {Job} = require('../../models');

async function processJob({rawJob}) {
  const {jobId} = rawJob;

  if (rawJob.blocked || rawJob.processed) {
    return false;
  }

  const oldJob = await Job.findOne({jobId});

  const jobDocumentResult = await generateJobDocument({rawJob, oldJob});

  rawJob.set({
    processed: true,
    processDate: new Date(),
    uploaded: Boolean(jobDocumentResult)
  });

  if (!jobDocumentResult) {
    await rawJob.save();
    return false;
  }

  let {
    job: newJob,
    trendCoeffs
  } = jobDocumentResult;

  if (oldJob) {
    oldJob.set(newJob);
  } else {
    rawJob.set({
      firstUploaded: new Date()
    });
  }

  rawJob.set({
    lastCoeffs: trendCoeffs
  });

  const result = await (oldJob || new Job(newJob)).save();

  await rawJob.save();

  return result;
}

/**
 * Generates "basic" job according to the "Job" model
 * @param {string} jobId job ID
 * @param {string} jobCurrId current job ID
 * @param {object} rawJob raw job object
 * @returns {object|undefined} generated object or undefined if the job
 * cannot be uploaded
 */
async function generateJobDocument({rawJob, oldJob}) {
  const {
    jobId,
    jobCurrId,
    job: rgscJob,
    star,
    tags,
    lastFetch: fetchDate,
    firstAddedToRgsc
  } = rawJob;

  const {
    name,
    desc,
    ver,
    nickname,
    cat: category,
    originalCreatorName,
    cdate,
    pdate,
    thumbnail: image,
    plat: platformName
  } = rgscJob.Metadata;

  const {
    loc: locations
  } = rgscJob.Metadata.data.meta;

  const {
    min: minPl,
    num: maxPl,
    tnum: teamsNumber,
  } = rgscJob.Metadata.data.mission.gen;

  const author = originalCreatorName || nickname;
  const scUpdated = pdate || cdate;
  const {stats, trendCoeffs} = generateJobStats({ rawJob, oldJob }) || {};
  const badName = isNameBad({rgscJob});
  const slug = slugify(name).toLowerCase();
  const background = await getBackground({rgscJob});

  if (!stats || badName || !slug) {
    return;
  }

  let job = {
    jobId,
    jobCurrId,
    name,
    desc,
    slug,
    image,
    players: [minPl, maxPl],
    ver,
    ...getScTypeAndMode({rgscJob}),
    tags: tags || [],
    locs: locations,
    stats,
    specific: await getJobSpecificFields({rgscJob}),
    scUpdated,
    fetchDate
  };

  job.star = !!star;

  if (author) {
    job.author = author;
  }

  if (teamsNumber > 1) {
    job.teams = teamsNumber;
  }

  if (background) {
    job.background = background;
  }

  if (category === 'rstar' || category === 'verif') {
    job.rockstar = true;
  } else {
    job.plat = platformName.toLowerCase();
  }

  // For example: CtQjYyAnNE27C6cIgGmfeQ
  if (!job.author && !job.rockstar) {
    return;
  }

  // 2. Add tags
  if (pitlaneAvailability({rgscJob})) {
    job.tags.push('pitlane');
  }

  // 3. If this is the first version of the job
  if (firstAddedToRgsc) {
    job.scAdded = firstAddedToRgsc;
  }

  return {
    job,
    trendCoeffs
  };
}

async function getJobSpecificFields({rgscJob}) {
  const {
    ivm: defVehicle,
    racetype
  } = rgscJob.Metadata.data.mission.gen;

  const raceInfo = rgscJob.Metadata.data.mission.race;

  const {
    lap: lapsNumber,
    chp: checkpointsNumber,
    rdis: dist,
    chl: checkpointsLocations,
    sndchk: secCheckpointsLocations,
    cptfrm: transformCheckpoints,
    aveh: vehicleClasses
  } = raceInfo;

  let specific = {};

  if (raceInfo) {
    Object.assign(specific, {
      p2p: !lapsNumber && racetype !== 'Laps',
      chp: checkpointsNumber,
      dist: dist || 13333
    });

    if (vehicleClasses && vehicleClasses.length) {
      specific.classes = getVehiclesClasses(vehicleClasses);
    }

    if (lapsNumber) {
      specific.laps = lapsNumber;
    }

    if (defVehicle) {
      specific.defVeh = String(defVehicle);
    }

    const chpLocsMapper = loc => [loc.x, loc.y];

    if (checkpointsLocations) {
      specific.chpLocs = checkpointsLocations.map(chpLocsMapper);
    }

    if (secCheckpointsLocations
      && secCheckpointsExist(secCheckpointsLocations)) {
      specific.chpSecLocs = secCheckpointsLocations.map(chpLocsMapper);
    }

    if (transformCheckpoints) {
      const trfVeh = secondaryVehicles(raceInfo);
      if (trfVeh.length) {
        specific.trfVeh = trfVeh;
      }
    }
  }

  return specific;
}

module.exports = {
  processJob
};
