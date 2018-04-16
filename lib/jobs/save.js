const config = require('../../config');
const RawJob = require('../../models/raw-job');

exports.saveAllRgscJobs = saveAllRgscJobs;

/**
 * Saves RGSC jobs to the DB.
 * @param {array} jobs Array or RGSC jobs object.
 * @returns {Promise<number>} number of successfully saved jobs
 */
async function saveAllRgscJobs(jobs) {
  let jobsToSave = [];

  jobs.forEach(job => {
    jobsToSave.push(saveRgscJob(job));
  });

  let jobsToSaveNumber = jobsToSave.length,
    jobsToSaveSuccess = jobsToSaveNumber;

  await Promise.all(
    jobsToSave.map(jobToSave => jobToSave.catch(err => {
      jobsToSaveSuccess--;
      return err;
    }))
  );

  return jobsToSaveSuccess;
}

/**
 * Saves a single RGSC job to the DB.
 * @param {object} job RGSC job object
 * @returns {undefined}
 */
async function saveRgscJob(job) {
  const jobId = job.Content.Metadata.RootContentId,
    jobCurrId = job.MissionId,
    version = job.Content.Metadata.ver;

  let newRawJob = {
    jobId,
    jobCurrId,
    job: job.Content,
    version,
    fetched: new Date(),
    uploaded: false
  };

  const oldRawJob = await RawJob.findOne({ jobId });

  if (oldRawJob) {
    if (!oldRawJob.uploaded) {
      throw new Error('Cannot overwrite the old raw job as it is not uploaded')
    }
    // newRawJob = Object.assign(oldRawJob, newRawJob);
  }

  await new RawJob(newRawJob).save();
}
