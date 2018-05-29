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
  try {
    const { job: rgscJob, jobId, removed } = fetchResult;

    const oldRawJob = await RawJob.findOne({ jobId });

    if (!rgscJob && !removed) {
      console.log(`${jobId} save err: not available (429?)`);
      return false;
    }

    if ((!rgscJob && removed) || !rgscJob.Content.stats) {
      if (!oldRawJob) {
        console.log(`${jobId} save err: new job doesn't have either body or "Content.stats" property`);
        return false;
      }

      console.log(`${jobId} save info: this jobs either was removed by its author or doesn't incorporate "Content.stats" object`)

      oldRawJob.set({
        processed: true,
        extended: true,
        fetchDate: new Date(),
        processDate: new Date()
      });

      await oldRawJob.save();

      return true;
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

    if (extended) {
      newRawJob.fetchDate = new Date();
    }

    if (oldRawJob) {
      oldRawJob.set(newRawJob);
    }

    await (oldRawJob || new RawJob(newRawJob)).save();

    console.log(`${jobId} save ok`);

    return true;
  } catch (error) {
    console.log(`saveJob error (${jobId}):`, error);
    return false;
  }
}
