const { processAllJobs } = require('../../lib/jobs/process');

module.exports = {
  jobUploadPost
};

async function jobUploadPost(req, res) {
  res.json({
    message: 'Jobs are being processed.'
  });

  const result = await processAllJobs();

  console.log(`Job(s) processed, results:`);

  result.forEach((res, i) => {
    console.log(`${i + 1}) ${res.jobId}: ${res.success ? 'processed' : 'not processed'}`);
  });
}
