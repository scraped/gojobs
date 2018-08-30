const {processJob} = require('../../jobs/process');
const {RawJob} = require('../../../models');

module.exports = async job => {
  const {jobId} = job.data;

  const rawJob = await RawJob.findOne({jobId});

  return await processJob({rawJob});
};
