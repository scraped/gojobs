const config = require('../../config');
const { diffObjects } = require('../helpers');

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
    if (success) {
      const jobId = jobs[i].Content.Metadata.RootContentId;
      result.push({ jobId, success });
    }
  });

  return result;
}

async function saveJob({ job, extended = false }) {
  try {
    const jobId = job.Content.Metadata.RootContentId;
    const jobCurrId = job.MissionId;

    let newRawJob = {
      jobId,
      jobCurrId,
      job: job.Content,
      fetchDate: new Date(),
      processed: false,
      uploaded: false,
      extended
    };

    const rawJob = await RawJob.findOne({ jobId });

    if (rawJob) {
      const statsDelta = diffObjects({
        oldObj: rawJob.job.stats,
        newObj: job.Content.stats
      });

      const differ = rawJob.job.Metadata.ver !== job.Content.Metadata.ver;
      const wasExtended = rawJob.extended;

      // No point of updating
      if (!extended && !differ && (!statsDelta || wasExtended)) {
        return false;
      }

      newRawJob.statsDelta = statsDelta;
    }

    await RawJob.findOneAndUpdate(
      { jobId },
      newRawJob,
      config.mongo.standardUpdateOptions
    );
  } catch (error) {
    console.log('saveJob error:', error);
    return false;
  }

  return true;
}
