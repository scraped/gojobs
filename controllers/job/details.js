const Job = require('../../models/job');

exports.jobDetailsPost = jobDetailsPost;

async function jobDetailsPost(req, res) {
  const jobId = req.params.id;

  const job = await Job.findOne({ jobId })
    .populate('details');

  if (job) {
    return res.json({
      job: job.toObject()
    });
  }

  return res.json();
};
