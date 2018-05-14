const RawJob = require('../../models/raw-job');
const _ = require('lodash');
const { diffObjects } = require('../helpers');

module.exports = {
  saveJobs
};

async function saveJobs({ jobs, extended }) {
  let jobsToSavePromises = jobs.map(job => {
    return saveJob({ job, extended }).catch(err => err);
  });

  const saveResults = await Promise.all(jobsToSavePromises);

  const result = saveResults.map((success, i) => {
    const jobId = jobs[i].Content.Metadata.RootContentId;
    return { jobId, success };
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
      uploaded: false,
      differ: true,
      extended
    };

    const rawJob = await RawJob.findOne({ jobId });

    if (rawJob) {
      const statsDelta = diffObjects({
        oldObj: rawJob.job.stats,
        newObj: job.Content.stats
      });

      const differ = rawJob.job.Metadata.ver !== job.Content.Metadata.ver;
      const { fetchDate } = rawJob;
      const wasExtended = rawJob.extended;

      if (!(!wasExtended && extended)
        && (fetchDate - new Date() < 60 * 60 * 12 || !differ && !statsDelta)) {
        return false;
      }

      Object.assign(newRawJob, {
        differ,
        fetchPrevDate: fetchDate,
        statsDelta
      });
    }

    await RawJob.findOneAndUpdate(
      { jobId },
      newRawJob,
      { upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    console.log('saveJob error:', error);
    return false;
  }

  return true;
}
