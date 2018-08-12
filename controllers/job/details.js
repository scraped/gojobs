const Job = require('../../models/job');

exports.jobDetailsPost = async (req, res) => {
  const {id: jobId} = req.params;

  const job = await Job.findOne({jobId}).populate('details');

  return res.json({job});
}
