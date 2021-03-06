const {diff} = require('deep-diff');
const addDays = require('date-fns/add_days');
const isFuture = require('date-fns/is_future');
const {RawJob} = require('../../models');
const fetchJob = require('./fetch-job');

function isPremiumRockstarRace(rgscJob) {
  const {cat, name} = rgscJob.Content.Metadata;
  return cat === 'rstar'
    && name.startsWith('Premium Race -');
}

function transformPlatform(plat) {
  const normPlat = plat.toLowerCase();
  if (normPlat === 'ps3') return 'ps4';
  if (normPlat === 'xbox') return 'xboxone';
  return normPlat;
}

async function saveJob({jobInitialId, rgscJob, platform}) {
  const oldRawJob = await RawJob.findOne({jobId: jobInitialId})
    || await RawJob.findOne({jobCurrId: jobInitialId});

  let actualRgscJob = rgscJob;

  const jobCurrId = actualRgscJob
    ? actualRgscJob.Content.Metadata.latestVersionContentId
    : oldRawJob.jobCurrId;

  if (!actualRgscJob
      || !actualRgscJob.Content
      || !actualRgscJob.Content.Metadata.latest) {
    actualRgscJob = (await fetchJob({
      jobId: jobCurrId,
      platform,
    })).rgscJob;
  }

  const newDate = new Date();

  // Latest version has been deleted
  if (!actualRgscJob
    || !actualRgscJob.Content
    || !actualRgscJob.Content.Metadata.latest) {
    if (oldRawJob && !actualRgscJob) {
      oldRawJob.set({
        processed: true,
        processDate: newDate,
        uploaded: false,
        lastFetch: newDate,
        nextFetch: addDays(newDate, 30),
        deleted: true,
      });

      return {
        rawJob: await oldRawJob.save(),
      };
    }

    throw new Error('Unable to fetch the latest version of the job');
  }

  if (isPremiumRockstarRace(actualRgscJob)) {
    throw new Error('This type of job is banned');
  }

  const jobId = actualRgscJob.Content.Metadata.RootContentId;

  const {
    stats: newStats = {},
    ratings: newRatings = {},
  } = actualRgscJob.Content;

  const {
    ver: newVersion,
    plat: rawPlatfom,
  } = actualRgscJob.Content.Metadata;

  let newRawJob = {
    jobId,
    jobCurrId,
    job: actualRgscJob.Content,
    normPlat: transformPlatform(rawPlatfom),
    processed: false,
    uploaded: false,
    lastFetch: newDate,
  };

  // This block fetches the very first version (tries if needed)
  if (newVersion !== 1 && (!oldRawJob
    || (!oldRawJob.firstAddedToRgsc && !oldRawJob.firstVerNotAvail))
  ) {
    const {rgscJob: firstVersionOfJob} = await fetchJob({jobId, platform});

    if (firstVersionOfJob && firstVersionOfJob.Content) {
      const {pdate, cdate} = firstVersionOfJob.Content.Metadata;
      newRawJob.firstAddedToRgsc = pdate || cdate;
    } else {
      newRawJob.firstVerNotAvail = true;
    }
  }

  if (!oldRawJob && newVersion === 1) {
    const {pdate, cdate} = actualRgscJob.Content.Metadata;
    newRawJob.firstAddedToRgsc = pdate || cdate;
  }

  let nextFetchDays = 0;

  if (oldRawJob) {
    const oldVersion = oldRawJob.job.Metadata.ver;

    if (newVersion === oldVersion) {
      if (isFuture(oldRawJob.nextFetch)) {
        return {
          error: 'This job should not be fetched right now',
        };
      }

      nextFetchDays = diff(oldRawJob.job.stats, newStats)
        ? 10
        : 20;

      newRawJob.job = {
        Metadata: oldRawJob.job.Metadata,
        stats: newStats,
        ratings: newRatings,
      };
    } else {
      const jobChanged = !!diff(
        oldRawJob.job.Metadata.data.mission,
        actualRgscJob.Content.Metadata.data.mission,
      );

      nextFetchDays = jobChanged
        ? 7
        : 14;

      newRawJob.versions = [
        ...oldRawJob.versions,
        {
          v: newVersion,
          jobId: jobCurrId,
          diff: jobChanged,
        },
      ];

      newRawJob.lastNewVerFetch = newDate;
    }
  } else {
    nextFetchDays = Object.keys(newStats).length
      ? 7
      : 10;

    Object.assign(newRawJob, {
      versions: {
        v: newVersion,
        jobId: jobCurrId,
        diff: true,
      },
      firstFetch: newDate,
      lastNewVerFetch: newDate,
    });
  }

  const rockstarJobCategories = ['rstar', 'verif'];

  if (rockstarJobCategories.includes(actualRgscJob.Content.Metadata.cat)) {
    nextFetchDays = 5;
  }

  newRawJob.nextFetch = addDays(newDate, nextFetchDays);

  if (oldRawJob) {
    oldRawJob.set(newRawJob);
  }

  const result = await (oldRawJob || new RawJob(newRawJob)).save();

  return {
    rawJob: result,
  };
}

module.exports = saveJob;
