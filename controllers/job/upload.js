const { processAllJobs } = require('../../lib/jobs/process');

exports.jobUploadPost = jobUploadPost;

function jobUploadPost(req, res) {
  const { limit, forced } = req.body;

  processAllJobs({ limit, forcedUpload: forced });

  res.json({
    message: 'Jobs are being uploaded.'
  });
};
