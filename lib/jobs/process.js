const slugify = require('slug');
const clamp = require('lodash/clamp');
const {generateJobStats} = require('./stats');

const {
  isNameBad,
  secondaryVehicles,
  getScTypeAndMode,
  pitlaneAvailability,
  getBackground,
  secCheckpointsExist,
  getVehiclesClasses,
} = require('./process-helpers');

const {Job} = require('../../models');

async function getJobSpecificFields({rgscJob}) {
  const raceInfo = rgscJob.Metadata.data.mission.race;

  const jobType = rgscJob.Metadata.data.mission.gen.type;

  let specific = {};

  if ((jobType === 'Race' || jobType === 'Parachuting') && raceInfo) {
    const {racetype} = rgscJob.Metadata.data.mission.gen;

    const defVehicle = String(rgscJob.Metadata.data.mission.gen.ivm);

    const {
      lap: lapsNumber,
      chp: checkpointsNumber,
      rdis: dist,
      chl: checkpointsLocations,
      sndchk: secCheckpointsLocations,
      cptfrm: transformCheckpoints,
      aveh: vehicleClasses,
    } = raceInfo;

    Object.assign(specific, {
      p2p: !lapsNumber && racetype !== 'Laps',
      chp: checkpointsNumber,
      dist,
    });

    if (vehicleClasses && vehicleClasses.length) {
      specific.classes = getVehiclesClasses(vehicleClasses);
    }

    if (lapsNumber) {
      specific.laps = lapsNumber;
    }

    if (defVehicle && defVehicle.length > 2) {
      specific.defVeh = defVehicle;
    }

    const chpLocsMapper = loc => [loc.x, loc.y];

    if (checkpointsLocations) {
      specific.chpLocs = checkpointsLocations.map(chpLocsMapper);
    }

    if (
      secCheckpointsLocations &&
      secCheckpointsExist(secCheckpointsLocations)
    ) {
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
    tags = [],
    lastFetch: fetchDate,
    firstAddedToRgsc,
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
    plat: platformName,
  } = rgscJob.Metadata;

  const locations = rgscJob.Metadata.data.meta.loc.filter(locName => locName);

  const {
    min: minPl,
    num: maxPl,
    tnum: teamsNumber,
  } = rgscJob.Metadata.data.mission.gen;

  let players = [];

  if (minPl) {
    players.push(clamp(minPl, 1, 30));
  }

  if (maxPl) {
    players.push(clamp(maxPl, 1, 30));
  }

  const author = originalCreatorName || nickname;
  const scUpdated = pdate || cdate;
  const {error: statsError, stats, trendCoeffs} = generateJobStats({
    rawJob,
    oldJob,
  });
  const badName = isNameBad({rgscJob});
  const slug = slugify(name).toLowerCase();
  const background = await getBackground({rgscJob});

  if (statsError) {
    return {
      error: statsError,
    };
  }

  if (badName) {
    return {
      error: 'Job has "bad" name',
    };
  }

  if (!slug) {
    return {
      error: 'Cannot slugify job name',
    };
  }

  let job = {
    jobId,
    jobCurrId,
    name,
    desc,
    slug,
    image,
    ver,
    ...getScTypeAndMode({rgscJob}),
    locs: locations,
    stats,
    specific: await getJobSpecificFields({rgscJob}),
    scUpdated,
    fetchDate,
  };

  if (players.length) {
    job.players = players;
  }

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
    return {
      error: 'Job has no author',
    };
  }

  // 2. Add tags
  let tagsSet = new Set(...tags);

  if (pitlaneAvailability({rgscJob})) {
    tagsSet.add('pitlane');
  }

  job.tags = [...tagsSet.values()];

  // 3. If this is the first version of the job
  if (firstAddedToRgsc) {
    job.scAdded = firstAddedToRgsc;
  }

  return {
    job,
    trendCoeffs,
  };
}

async function processJob({rawJob}) {
  const {jobId, blocked, processed} = rawJob;

  if (blocked) {
    throw new Error('This job is banned');
  }

  if (processed) {
    throw new Error('This job has already been processed');
  }

  const oldJob = await Job.findOne({jobId});

  const jobDocumentResult = await generateJobDocument({rawJob, oldJob});

  const errorOccured = jobDocumentResult.error;

  rawJob.set({
    processed: true,
    processDate: new Date(),
    uploaded: !errorOccured,
  });

  if (errorOccured) {
    await rawJob.save();
    return {
      error: errorOccured,
    };
  }

  let {job: newJob, trendCoeffs} = jobDocumentResult;

  if (oldJob) {
    oldJob.set(newJob);
  }

  if (!rawJob.firstUploaded) {
    rawJob.set({
      firstUploaded: new Date(),
    });
  }

  rawJob.set({
    lastCoeffs: trendCoeffs,
  });

  const result = await (oldJob || new Job(newJob)).save();

  await rawJob.save();

  return result;
}

module.exports = {
  processJob,
};
