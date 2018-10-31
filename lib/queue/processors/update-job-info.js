const fetchJob = require('../../rgsc/fetch-job');
const saveJob = require('../../rgsc/save-job');
const {validate} = require('../../../validators');

module.exports = async job => {
  const {jobId, platform} = job.data;

  if (!validate('jobId', jobId)) {
    throw new Error('Incorrect job ID');
  }

  const rgscJob = await fetchJob({jobId, platform});
  const rawJob = await saveJob({jobId, rgscJob, platform});

  return {
    rawJob,
  };
};
