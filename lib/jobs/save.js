const config = require('../../config');
// const { diffObjects } = require('../helpers');

const RawJob = require('../../models/raw-job');

module.exports = {
  saveJobs
};

async function saveJobs({ jobs, extended }) {
  const saveResults = await Promise.all(
    jobs.map(job => saveJob({ job, extended }).catch(err => err))
  );

  let result = [];

  saveResults.forEach((success, i) => {
    const { jobId } = jobs[i];
    result.push({ jobId, success });
  });

  return result;
}

async function saveJob({ job, extended = false }) {
  const { job: rgscJob, jobId } = job;

  const oldRawJob = await RawJob.findOne({ jobId });

  try {
    if (oldRawJob) {
      // Sometimes "extended" jobs are not available and rockstar servers
      // response is empty OR stats is not present
      if (oldRawJob && extended && (!rgscJob || !rgscJob.Content.stats)) {
        oldRawJob.set({ processed: true });
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
