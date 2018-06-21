const { diffObjects } = require('../helpers');
const RawJob = require('../../models/raw-job');

module.exports = {
  saveJobs
};

async function saveJobs({ fetchResults, extended }) {
  const results = await Promise.all(
    fetchResults.map(fetchResult => saveJob({ fetchResult, extended }))
  );

  const saveResults = results.map((success, i) => {
    const { jobId } = fetchResults[i];
    return { jobId, success };
  });

  return {
    saveResults
  };
}

async function saveJob({ fetchResult, extended = false }) {
  const { job: rgscJob, jobId, status } = fetchResult;

  try {
    const oldRawJob = await RawJob.findOne({ jobId });

    if (status === 'NO_STATS_PROPERTY') {
      oldRawJob.set({
        processed: true,
        extended: true,
        fetchDate: new Date(),
        processDate: new Date()
      });

      await oldRawJob.save();

      return true;
    } else if (status) {
      console.log(`${jobId} not saved: ${status}`);
      return false;
    }

    let newRawJob = {
      jobId,
      jobCurrId: rgscJob.MissionId,
      job: rgscJob.Content,
      processed: false,
      uploaded: false,
      extended
    };

    if (oldRawJob && !extended) {
      const { stats: newStats, ratings: newRatings } = rgscJob.Content;

      const versionsDiffer = oldRawJob.job.Metadata.ver
        !== rgscJob.Content.Metadata.ver;

      const statsChanges = diffObjects({
        oldObj: oldRawJob.job.stats,
        newObj: newStats
      });

      if (!versionsDiffer) {
        if (!statsChanges) {
          console.log(`${jobId} not saved: no stats changes`);
          return false;
        }

        newRawJob.job = {
          Metadata: oldRawJob.job.Metadata,
          stats: newStats,
          ratings: newRatings
        };
      }
    }

    if (extended) {
      newRawJob.fetchDate = new Date();
    }

    if (oldRawJob) {
      oldRawJob.set(newRawJob);
    }

    await (oldRawJob || new RawJob(newRawJob)).save();

    console.log(`${jobId} save successfully`);

    return true;
  } catch (error) {
    console.log(`saveJob error (${jobId}):`, error);
    return false;
  }
}
