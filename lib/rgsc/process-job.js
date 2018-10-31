const slugify = require('slug');
const clamp = require('lodash/clamp');
const {generateJobStats} = require('./job-stats');
const {RawJob} = require('../../models');

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
      secCheckpointsLocations
      && secCheckpointsExist(secCheckpointsLocations)
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

async function generateJobDocument({rawJob, oldJob}) {
  const {
    jobId,
    jobCurrId,
    job: rgscJob,
    star,
    tags = [],
    lastFetch: fetchDate,
    firstAddedToRgsc,
    normPlat,
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
  } = rgscJob.Metadata;

  const locations = rgscJob.Metadata.data.meta.loc.filter(locName => locName);

  const {
    min: minPl = 1,
    num: maxPl = 30,
    tnum: teamsNumber,
  } = rgscJob.Metadata.data.mission.gen;

  const players = [
    clamp(minPl, 1, 30),
    clamp(maxPl, 1, 30),
  ];

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
    job.plat = normPlat;
  }

  // For example: CtQjYyAnNE27C6cIgGmfeQ
  if (!job.author && !job.rockstar) {
    return {
      error: 'Being non-rockstar, the job has no author',
    };
  }

  // 2. Add tags
  let tagsSet = new Set(tags);

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

async function processJob({jobId, onlyUpdateCoeffs = false}) {
  const rawJob = await RawJob.findOne({jobId});

  if (!rawJob) {
    throw new Error(`Job "${jobId}" was not found`);
  }

  const {blocked, processed, deleted, uploaded} = rawJob;

  if (blocked) {
    throw new Error('This job is banned');
  }

  if (!onlyUpdateCoeffs && processed) {
    throw new Error('This job has already been processed');
  }

  if (deleted) {
    throw new Error('This job has been deleted from RGSC');
  }

  const oldJob = await Job.findOne({jobId});

  if (onlyUpdateCoeffs
    && (!oldJob || !uploaded)) {
    throw new Error('In order to update coefficients the job must be uploaded on the site.');
  }

  const jobDocumentResult = await generateJobDocument({rawJob, oldJob});

  const errorOccured = jobDocumentResult.error;

  if (onlyUpdateCoeffs && errorOccured) {
    throw new Error(`The following error occured: "${errorOccured}"`);
  }

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

  const jobDoc = await (oldJob || new Job(newJob)).save();

  await rawJob.save();

  return jobDoc;
}

module.exports = processJob;
