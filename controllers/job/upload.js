const { processAllJobs } = require('../../lib/jobs/process');

module.exports = {
  jobUploadPost
};

function jobUploadPost(req, res) {
  const { uploadAll } = req.body;

  processAllJobs({ forceUploadAll: Boolean(uploadAll) });

  res.json({
    message: 'Jobs are being uploaded.'
  });
};
