const {diffObjects} = require('../helpers');
const RawJob = require('../../models/raw-job');
const {fetchJob} = require('./fetch');

async function saveJob({
  rgscJob,
  extended = true
}) {
  const {
    RootContentId: jobId,
    latestVersionContentId: jobCurrId
  } = rgscJob.Content.Metadata;

  if (!extended
    || !rgscJob.Content.Metadata.latest) {
    rgscJob = await fetchJob({
      jobId: jobCurrId
    });
  }

  const {
    stats: newStats,
    ratings: newRatings,
    ver: newVersion
  } = rgscJob.Content;

  // New jobs don't have both stats and rating properties
  if (!newStats) {
    rgscJob.Content.stats = {};
    rgscJob.Content.ratings = {};
  }

  // Create only 1 date object
  const newDate = new Date();

  let newRawJob = {
    jobId,
    jobCurrId,
    job: rgscJob.Content,
    processed: false,
    uploaded: false,
    fetchDate: newDate
  };

  const oldRawJob = await RawJob.findOne({jobId});

  if (newVersion !== 1
    && (!oldRawJob || !oldRawJob.firstAddedToRgsc)) {
    newRawJob.firstAddedToRgsc = (await fetchJob({jobId})).Content.Metadata.pdate;
  }

  if (oldRawJob) {
    const oldJobCurrId = oldRawJob.job.Metadata;

    if (oldJobCurrId === jobCurrId) {
      const statsChanges = diffObjects({
        oldObj: oldRawJob.job.stats,
        newObj: newStats
      });

      if (!statsChanges) {
        return;
      }

      newRawJob.job = {
        Metadata: oldRawJob.job.Metadata,
        stats: newStats,
        ratings: newRatings
      };
    } else {
      newRawJob.fetchNewVerDate = newDate;
    }

    oldRawJob.set(newRawJob);
  } else {
    newRawJob.firstFetchDate = newDate;
    newRawJob.fetchNewVerDate = newDate;
  }

  return await (oldRawJob || new RawJob(newRawJob)).save();
}

module.exports = {
  saveJob
};
