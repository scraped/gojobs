const { diffObjects } = require('../helpers');
const RawJob = require('../../models/raw-job');

module.exports = {
  saveJobs
};

async function saveJobs({ fetchResults, extended }) {
  const fetchResultsToSavePromises = fetchResults.map(fetchResult =>
    saveJob({ fetchResult, extended }).catch(err => err)
  )
  const results = await Promise.all(fetchResultsToSavePromises);

  const saveResults = results.map((success, i) => {
    const { jobId } = fetchResults[i];
    return { jobId, success };
  });

  return {
    saveResults
  };
}

async function saveJob({ fetchResult, extended = false }) {
  const rgscJob = fetchResult.job;

  const jobId = rgscJob.Content.Metadata.RootContentId;

  try {
    let newRawJob = {
      jobId,
      jobCurrId: rgscJob.MissionId,
      job: rgscJob.Content,
      processed: false,
      uploaded: false,
      extended
    };

    const oldRawJob = await RawJob.findOne({ jobId });

    if (oldRawJob) {
      // Sometimes "extended" jobs are not available and rockstar servers
      // response is empty OR stats is not present
      if (extended && (!rgscJob || !rgscJob.Content.stats)) {
        oldRawJob.set({ processed: true, extended: true });
        await oldRawJob.save();
        return true;
      }

      if (!extended) {
        const { stats: newStats, ratings: newRatings } = rgscJob.Content;

        const versionsDiffer = oldRawJob.job.Metadata.ver
          !== rgscJob.Content.Metadata.ver;

        const statsChanges = diffObjects({
          oldObj: oldRawJob.job.stats,
          newObj: newStats
        });

        if (!versionsDiffer) {
          // eslint-disable-next-line
          if (!statsChanges) {
            return true;
          }

          newRawJob.job = {
            Metadata: oldRawJob.job.Metadata,
            stats: newStats,
            ratings: newRatings
          };
        }
      }
    }

    if (extended) {
      newRawJob.fetchDate = new Date();
    }

    if (oldRawJob) {
      oldRawJob.set(newRawJob);
    }

    await (oldRawJob || new RawJob(newRawJob)).save();

    return true;
  } catch (error) {
    console.log(`saveJob error (${jobId}):`, error);
    return false;
  }
}
