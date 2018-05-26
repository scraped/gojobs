const {
  fetchJobsAndSave
} = require('../../lib/jobs');

module.exports = {
  jobsFetchPost
};

async function jobsFetchPost(req, res) {
  const { bunches, category, id, platform, period, reqLimit } = req.body;

  res.json({
    message: 'Jobs are being fetched.'
  });

  try {
    const { saveResults } = await fetchJobsAndSave(
      { bunches, category, id, platform, period, reqLimit }
    );

    saveResults.forEach((result, i) => {
      const { jobId, success } = result;
      const verdict = success ? 'saved' : 'not saved';
      // if (success) saved++;
      console.log(`${i + 1}) ${jobId} fetched & ${verdict}`);
    });
  } catch (error) {
    console.log('jobsFetchPost error:', error);
  }
}
