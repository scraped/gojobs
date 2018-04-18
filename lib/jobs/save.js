const RawJob = require('../../models/raw-job');
const _ = require('lodash');
const { diffObjects } = require('../helpers');

exports.saveAllRgscJobs = saveAllRgscJobs;

/**
 * Saves RGSC jobs to the DB.
 * @param {array} jobs Array or RGSC jobs object.
 * @returns {Promise<object>} {toSave: number, success: number}
 * toSave - number of jobs to save, success - number of successfully
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
      jobsToSaveSuccess--;
      return err;
    }))
  );

  return {
    toSave: jobsToSaveNumber,
    success: jobsToSaveSuccess
  }
}

/**
 * Saves a single RGSC job to the DB.
 * @param {object} job RGSC job object
 * @returns {undefined}
 */
async function saveRgscJob(job) {
  const jobId = job.Content.Metadata.RootContentId,
    jobCurrId = job.MissionId;

  const oldRawJob = await RawJob.findOne({ jobId });

  let newRawJob = {},
    delta = null;

  if (oldRawJob) {
    if (!oldRawJob.uploaded) {
      throw new Error('Cannot overwrite the old raw job as it is not uploaded')
    }

    newRawJob._id = oldRawJob._id;
    newRawJob.delta = diffObjects(oldRawJob.job, job.Content);
  }

  newRawJob = {
    ...newRawJob,
    jobId,
    jobCurrId,
    job: job.Content,
    fetchDate: new Date(),
    uploaded: false
  };

  await new RawJob(newRawJob).save();
}
