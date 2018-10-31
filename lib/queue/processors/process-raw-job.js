const processJob = require('../../rgsc/process-job');
const {validate} = require('../../../validators');

module.exports = async job => {
  const {jobId, onlyUpdateCoeffs} = job.data;

  if (!validate('jobId', jobId)) {
    throw new Error('Incorrect job ID');
  }

  const jobDoc = await processJob({jobId, onlyUpdateCoeffs});

  return {
    job: jobDoc,
  };
};
