const RawJob = require('../../models/raw-job');
const _ = require('lodash');
const { diffObjects } = require('../helpers');

module.exports = {
  saveRegularJobs
};

function saveRegularJobs(jobs) {
  jobs.forEach(async job => {
    const jobId = job.Content.Metadata.RootContentId;
    const jobCurrId = job.MissionId;

    const rawJob = await RawJob.find({ jobId });

    let newRawJob = {
      jobId,
      jobCurrId,
      job: job.Content,
      fetchDate: new Date()
    };

    if (rawJob) {
      newRawJob._id = rawJob._id;
    }

    if (!rawJob) {

      if (rawJp)

      await newRawJob.save();
      return;
    }

    if (rawJob.uploaded) {

    }
  });
}

/**
 * Saves RGSC jobs to the DB.
 * @param {array} jobs Array or RGSC jobs object.
 * @returns {Promise<object>} {toSave: number, saved: number}
 * toSave - number of jobs to save, saved - number of successfully
 * saved jobs
 */
async function saveAllRgscJobs(jobs) {
  let jobsToSave = [];

  jobs.forEach(job => {
    jobsToSave.push(saveRgscJob(job));
  });

  const jobsToSaveNumber = jobsToSave.length;
  let jobsToSaveSuccess = jobsToSaveNumber;

  await Promise.all(
    jobsToSave.map(jobToSave => jobToSave.catch(err => {
      console.log(err);
      jobsToSaveSuccess--;
      return err;
    }))
  );

  return {
    toSave: jobsToSaveNumber,
    saved: jobsToSaveSuccess
  }
}

/**
 * Saves a single RGSC job to the DB.
 * @param {object} job RGSC job object
 * @returns {undefined}
 */
async function saveRgscJob(job) {
  if (!job.MissionId) {
    console.log('job:', job);
    throw new Error('Incorrect job format');
  }

  const jobId = job.Content.Metadata.RootContentId,
    jobCurrId = job.MissionId;

  let newRawJob = {
    jobId,
    jobCurrId,
    job: job.Content,
    fetchDate: new Date(),
    uploaded: false
  };

  const oldRawJob = await RawJob.findOne({ jobId });

  if (oldRawJob) {
    if (!oldRawJob.uploaded) {
      throw new Error('Cannot overwrite the old raw job as it is not uploaded');
    }

    // "newObj" is actually an old object because we want "delta" to consist of
    // "old" values. Note: this returns null if turned out no delta
    const delta = diffObjects({
      oldObj: job.Content,
      newObj: oldRawJob.job
    });

    if (!delta) {
      throw new Error('Do not need to reupload - no changed detected');
    }

    newRawJob.delta = delta;
    newRawJob = Object.assign(oldRawJob, newRawJob);
  }

  await new RawJob(newRawJob).save();
}
