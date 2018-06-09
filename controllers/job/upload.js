const { processJobs } = require('../../lib/jobs/process');

module.exports = {
  jobUploadPost
};

async function jobUploadPost(req, res) {
  res.json({
    message: 'Jobs are being processed.'
  });

  const { any, limit } = req.body;

  const result = await processJobs({
    any: Boolean(any),
    limit: Number(limit)
  });

  if (!result.length) {
    console.log('No jobs to process');
  }

  result.forEach((res, i) => {
    console.log(`${i + 1}) ${res.jobId} ${res.success ? 'processed' : 'not processed'}`);
  });
}
