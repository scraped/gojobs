const differenceWith = require('lodash/differenceWith');
const {diffObjects} = require('../helpers');
const {RawJob} = require('../../models');
const {fetchJob} = require('./fetch');

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
    differenceWith(oldProps.loc, newProps.loc, comparator).length &&
    differenceWith(oldDynamicProps.loc, newDynamicProps.loc, comparator).length
  );
}

async function saveJob({rgscJob}) {
  const {
    RootContentId: jobId,
    latestVersionContentId: jobCurrId,
  } = rgscJob.Content.Metadata;

  if (!rgscJob.Content.Metadata.latest) {
    rgscJob = await fetchJob({
      jobId: jobCurrId,
    });
  }

  const {
    stats: newStats,
    ratings: newRatings,
    ver: newVersion,
  } = rgscJob.Content;

  // New jobs don't have both stats and rating properties
  if (!newStats) {
    rgscJob.Content.stats = {};
    rgscJob.Content.ratings = {};
  }

  // Create only one date object
  const newDate = new Date();

  let newRawJob = {
    jobId,
    jobCurrId,
    job: rgscJob.Content,
    processed: false,
    uploaded: false,
    lastFetch: newDate,
  };

  const oldRawJob = await RawJob.findOne({jobId});

  if (
    newVersion !== 1 &&
    (!oldRawJob || (!oldRawJob.firstAddedToRgsc && !oldRawJob.firstVerNotAvail))
  ) {
    try {
      const {pdate, cdate} = (await fetchJob({jobId})).Content.Metadata;
      newRawJob.firstAddedToRgsc = pdate || cdate;
    } catch (error) {
      newRawJob.firstVerNotAvail = true;
    }
  }

  if (oldRawJob) {
    const oldJobCurrId = oldRawJob.job.Metadata;

    if (oldJobCurrId === jobCurrId) {
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
          chg: jobChanged(oldRawJob.job, rgscJob.Content),
        },
      };

      newRawJob.lastNewVerFetch = newDate;
    }

    oldRawJob.set(newRawJob);
  } else {
    newRawJob.versions = {
      ver: newVersion,
      id: jobCurrId,
      chg: true,
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
