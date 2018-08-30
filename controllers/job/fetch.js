const {fetchQueue} = require('../../lib/queue');

async function jobsFetchPost(req, res) {
  const {
    bunches, strict, category, id, platform, period, reqLimit
  } = req.body;

  fetchQueue.add(
    'fetch',
    {
      type: 'job',
      data: {
        jobId: id
      }
    },
    {
      jobId: id
    }
  );

  res.json({
    message: 'Jobs are being fetched.'
  });

  // try {
  //   await fetchJobsAndSave({
  //     bunches,
  //     strict: Boolean(strict),
  //     category,
  //     id,
  //     platform,
  //     period,
  //     reqLimit
  //   });
  // } catch (error) {
  //   console.log('jobsFetchPost error:', error);
  // }
}

module.exports = {
  jobsFetchPost
};
