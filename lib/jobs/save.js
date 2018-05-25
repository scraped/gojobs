const RawJob = require('../../models/raw-job');

module.exports = {
  saveJobs
};

async function saveJobs({ fetchResults, extended }) {
  const fetchResultsToSavePromises = fetchResults.map(fetchResult =>
    saveJob({ fetchResult, extended }).catch(err => err)
  )
  const saveResults = await Promise.all(fetchResultsToSavePromises);

  const result = saveResults.map((success, i) => {
    const { jobId } = fetchResults[i];
    return { jobId, success };
  });

  return result;
}

async function saveJob({ fetchResult, extended = false }) {
  const { job: rgscJob } = fetchResult;

  const jobId = rgscJob.Content.Metadata.RootContentId

  const oldRawJob = await RawJob.findOne({ jobId });

  try {
    if (oldRawJob) {
      // Sometimes "extended" jobs are not available and rockstar servers
      // response is empty OR stats is not present
      if (oldRawJob && extended && (!rgscJob || !rgscJob.Content.stats)) {
        oldRawJob.set({ processed: true, extended: true });
        await oldRawJob.save();
        return true;
      }

      const differ = oldRawJob.job.Metadata.ver !== rgscJob.Content.Metadata.ver;
      const wasExtended = oldRawJob.extended;

      if (!extended && !differ && wasExtended) {
        return false;
      }
    }

    const rawJob = {
      jobId,
      jobCurrId: rgscJob.MissionId,
      job: rgscJob.Content,
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
