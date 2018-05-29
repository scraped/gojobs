const {
  fetchJobsAndSave
} = require('../../lib/jobs');

module.exports = {
  jobsFetchPost
};

async function jobsFetchPost(req, res) {
  const {
    bunches, strict, category, id, platform, period, reqLimit
  } = req.body;

  res.json({
    message: 'Jobs are being fetched.'
  });

  try {
    await fetchJobsAndSave({
      bunches,
      strict: Boolean(strict),
      category,
      id,
      platform,
      period,
      reqLimit
    });
  } catch (error) {
    console.log('jobsFetchPost error:', error);
  }
}
