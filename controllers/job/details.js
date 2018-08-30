const {Job} = require('../../models');

exports.jobDetailsPost = async (req, res) => {
  const {id: jobId} = req.params;

  const job = await Job.findOne({jobId});

  return res.json({job});
}
