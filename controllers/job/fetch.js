const {
  fetchJobsAndSave,
  fetchJobsBunchesAndSave
} = require('../../lib/jobs');

module.exports = {
  jobFetchPost,
  jobFetchExtendedPost
};

async function jobFetchExtendedPost(req, res) {
  const { jobId, proxy } = req.body;

  res.json({
    message: 'Jobs are being fetched.'
  });

  const { result } = await fetchJobsAndSave({ jobId, proxy });

  // const fetched = result.length;
  // let saved = 0;

  result.forEach((res, i) => {
    const { jobId, success } = res;
    const verdict = success ? 'saved' : 'not saved';
    // if (success) saved++;
    console.log(`${i + 1}) ${jobId} fetched & ${verdict}`);
  });
}

async function jobFetchPost(req, res) {
  const { category, id, platform, period, limit } = req.body;

  let options = {
    period,
    category: category || 'all',
    bLimit: limit
  };

  if (category === 'user' || category === 'crew') {
    options.id = id;
  }

  if (category !== 'rockstar' && category !== 'rstarverified') {
    options.platform = platform;
  }

  try {
    let { total, result } = await fetchJobsBunchesAndSave(options);

    console.log(`Job(s) fetched, total: ${total}, results:`);

    result.forEach((res, i) => {
      console.log(`${i + 1}) ${res.jobId} ${res.success ? 'saved' : 'not saved'}`);
    });
  } catch (error) {
    console.log('Job(s) not fetched, error:', error);
  }

  res.json({
    message: 'Jobs fetched.'
  });
}
