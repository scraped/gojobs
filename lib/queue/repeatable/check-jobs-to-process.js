const {RawJob} = require('../../../models');

module.exports = async queue => {
  const limit = 100;

  const jobsToProcess = await RawJob.find({processed: false})
    .limit(limit);

  const jobIds = jobsToProcess.map(({jobId}) => jobId);

  jobIds.forEach(jobId => {
    queue.add('process-raw-job', {jobId}, {jobId});
  });

  return {
    found: jobIds.length,
    jobIds,
    limit,
  };
};
