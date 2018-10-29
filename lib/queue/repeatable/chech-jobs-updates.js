const {RawJob} = require('../../../models');

module.exports = async queue => {
  const limit = 90;

  const jobUpdates = await RawJob.find({
    nextFetch: {
      $lte: new Date(),
    },
    deleted: {
      $ne: true,
    },
  }).limit(limit);

  const jobIds = jobUpdates.map(({jobId}) => jobId);

  jobIds.forEach(jobId => {
    queue.add('update-job-info', {jobId}, {jobId});
  });

  return {
    found: jobIds.length,
    limit,
    jobIds,
  };
};
