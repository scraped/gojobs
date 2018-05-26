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
  const { job: rgscJob } = fetchResult;

  const jobId = rgscJob.Content.Metadata.RootContentId;

  const oldRawJob = await RawJob.findOne({ jobId });

  try {
    let job = rgscJob.Content;

    if (oldRawJob) {
      // Sometimes "extended" jobs are not available and rockstar servers
      // response is empty OR stats is not present
      if (extended && (!rgscJob || !rgscJob.Content.stats)) {
        oldRawJob.set({ processed: true, extended: true });
        await oldRawJob.save();
        return true;
      }

      const versionsDiffer = oldRawJob.job.Metadata.ver
        !== rgscJob.Content.Metadata.ver;

      if (oldRawJob.extended && !extended && !versionsDiffer) {
        const { stats: newStats, ratings: newRatings } = rgscJob.Content;

        if (!diffObjects({
          oldObj: oldRawJob.job.stats,
          newObj: newStats
        })) {
          return false;
        }

        job = {
          Metadata: oldRawJob.job.Metadata,
          stats: newStats,
          ratings: newRatings
        };
      }
    }

    const rawJob = {
      jobId,
      jobCurrId: rgscJob.MissionId,
      job,
      fetchDate: new Date(),
      processed: false,
      uploaded: false,
      extended
    };

    if (oldRawJob) {
      oldRawJob.set(rawJob);
    }

    await (oldRawJob || new RawJob(rawJob)).save();

    return true;
  } catch (error) {
    console.log(`saveJob error (${jobId}):`, error);
    return false;
  }
}
