const differenceWith = require('lodash/differenceWith');
const {diffObjects} = require('../helpers');
const {RawJob} = require('../../models');
const {fetchJob} = require('./fetch-job');
const {diff} = require('deep-diff')

// Difference is defined by props
function jobChanged(oldRgscJobContent, newRgscJobContent) {
  const {
    prop: oldProps,
    dprop: oldDynamicProps,
  } = oldRgscJobContent.Metadata.data.mission;

  const {
    prop: newProps,
    dprop: newDynamicProps,
  } = newRgscJobContent.Metadata.data.mission;

  const comparator = (val1, val2) => val1.x === val2.x && val1.y === val2.y;

  return (
    differenceWith(oldProps.loc, newProps.loc, comparator).length
    && differenceWith(oldDynamicProps.loc, newDynamicProps.loc, comparator).length
  );
}

async function saveJob({rgscJob}) {
  let actualRgscJob = rgscJob;

  const {
    RootContentId: jobId,
    latestVersionContentId: jobCurrId,
    latest: wasLatest,
  } = actualRgscJob.Content.Metadata;

  if (!wasLatest) {
    actualRgscJob = await fetchJob({
      jobId: jobCurrId,
    });
  }

  const {
    stats: newStats = {},
    ratings: newRatings = {},
    ver: newVersion,
  } = actualRgscJob.Content;

  // Create only one date object
  const newDate = new Date();

  let newRawJob = {
    jobId,
    jobCurrId,
    job: actualRgscJob.Content,
    processed: false,
    uploaded: false,
    lastFetch: newDate,
  };

  const oldRawJob = await RawJob.findOne({jobId});

  // This block fetches the very first version (tries if needed)
  if (newVersion !== 1 && (!oldRawJob
    || (!oldRawJob.firstAddedToRgsc && !oldRawJob.firstVerNotAvail))
  ) {
    const response = await fetchJob({jobId});

    if (response) {
      const {pdate, cdate} = response.data.Content.Metadata;
      newRawJob.firstAddedToRgsc = pdate || cdate;
    } else {
      newRawJob.firstVerNotAvail = true;
    }
  }

  let nextFetchDays = 0;

  if (oldRawJob) {
    const oldVersion = oldRawJob.job.Metadata.ver;

    if (newVersion === oldVersion) {
      if ()
      const statsChanges = diffObjects({
        oldObj: oldRawJob.job.stats,
        newObj: newStats,
      });

      if (!statsChanges) {
        return;
      }

      newRawJob.job = {
        Metadata: oldRawJob.job.Metadata,
        stats: newStats,
        ratings: newRatings,
      };
    } else {
      newRawJob.$push = {
        versions: {
          ver: newVersion,
          id: jobCurrId,
          diff: jobChanged(oldRawJob.job, rgscJob.Content),
        },
      };

      newRawJob.lastNewVerFetch = newDate;
    }

    oldRawJob.set(newRawJob);
  } else {
    newRawJob.versions = {
      ver: newVersion,
      id: jobCurrId,
      diff: true,
    };

    newRawJob.firstFetch = newDate;
    newRawJob.lastNewVerFetch = newDate;
  }

  const result = await (oldRawJob || new RawJob(newRawJob)).save();

  return result;
}

module.exports = {
  saveJob,
};
