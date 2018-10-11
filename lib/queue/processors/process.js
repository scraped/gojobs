const processJob = require('../../jobs/process-job');
const {RawJob} = require('../../../models');

module.exports = async job => {
  const {jobId} = job.data;

  const rawJob = await RawJob.findOne({jobId});
  const result = await processJob({rawJob});

  return result;
};
