const clamp = require('lodash/clamp');
const {processQueue} = require('../../lib/queue');
const {RawJob} = require('../../models');

async function jobUploadPost(req, res) {
  const PROCESS_DEFAULT_LIMIT = 3000;

  let {limit} = req.body;

  limit = clamp(limit, 1, PROCESS_DEFAULT_LIMIT);

  const rawJobs = await RawJob.find({ processed: false }).limit(limit);

  rawJobs.forEach(rawJob => {
    const {jobId} = rawJob;
    processQueue.add(
      'process',
      {
        jobId
      },
      {
        jobId: jobId
      }
    );
  });

  res.json({
    message: `${rawJobs.length} jobs has been added to the queue.`
  });
}

module.exports = {
  jobUploadPost
};
