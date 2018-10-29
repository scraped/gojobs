const fetchJob = require('../../rgsc/fetch-job');
const saveJob = require('../../rgsc/save-job');
const {validate} = require('../../../validators');

module.exports = async function fetchJobJob(data) {
  const {jobId} = data;

  if (!validate('jobId', jobId)) {
    throw new Error('Incorrect job ID');
  }

  const rgscJob = await fetchJob({jobId});
  const rawJob = await saveJob({jobId, rgscJob});

  return rawJob;
};
