const RawJob = require('../../models/raw-job');
const _ = require('lodash');
const { diffObjects } = require('../helpers');

module.exports = {
  saveJobs
};

async function saveJobs({ jobs, extended }) {
  let saveResult = [];
  let jobsToSavePromises = [];

  jobs.forEach(job => {
    jobsToSavePromises.push(
      saveRegularJob({ job, extended }).catch(err => err)
    );
  });

  const saveResults = await Promise.all(jobsToSavePromises);

  saveResults.forEach((success, i) => {
    const jobId = jobs[i].Content.Metadata.RootContentId;
    saveResult.push({ id: jobId, success });
  });

  return saveResult;
}

async function saveRegularJob({ job, extended = false }) {
  try {
    const jobId = job.Content.Metadata.RootContentId;
    const jobCurrId = job.MissionId;

    let newRawJob = {
      jobId,
      jobCurrId,
      job: job.Content,
      fetchDate: new Date(),
      uploaded: false
    };

    if (extended) {
      newRawJob.extended = extended;
    }

    const rawJob = await RawJob.findOne({ jobId });

    if (rawJob) {
      const statsDelta = diffObjects({
        oldObj: rawJob.job.stats,
        newObj: job.Content.stats
      });

      const differ = rawJob.job.Metadata.ver !== job.Content.Metadata.ver;

      const { fetchPrevDate } = rawJob;

      if (fetchPrevDate && fetchPrevDate - new Date() < 60 * 60 * 12
        || !rawJob.uploaded && differ
        || !differ && !statsDelta) {
        return false;
      }

      rawJob.fetchPrevDate = rawJob.fetchDate;
      rawJob.statsDelta = statsDelta;
    }

    await RawJob.findOneAndUpdate(
      { jobId },
      newRawJob,
      { upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    console.log('saveRegularJob error:', error);
    return false;
  }

  return true;
}
