const processJob = require('../../rgsc/process-job');
const {RawJob} = require('../../../models');
const {validate} = require('../../../validators');

module.exports = async job => {
  const {jobId} = job.data;

  if (!validate('jobId', jobId)) {
    throw new Error('Incorrect job ID');
  }

  const rawJob = await RawJob.findOne({jobId});

  const result = await processJob({rawJob});

  return result;
};
