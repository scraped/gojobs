const {RawJob} = require('../../../models');

module.exports = async queue => {
  const limit = 1000;

  const jobsToProcess = await RawJob.find({processed: false})
    .limit(limit);

  const jobIds = jobsToProcess.map(({jobId}) => jobId);

  await Promise.all(jobIds.map(
    jobId => queue.add('process-raw-job', {jobId}, {jobId: `process_${jobId}`}),
  ));

  return {
    found: jobIds.length,
    limit,
    jobIds,
  };
};
