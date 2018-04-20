const { fetchAndSave } = require('../../lib/jobs');

module.exports = {
  jobFetchPost
};

async function jobFetchPost(req, res) {
  const {
    by, key, platform, period, limit, skip
  } = req.body;

  let options = {
    period
  };

  if (by) {
    options.by = by;
    if (by === 'member' || by === 'crew' || by === 'job') {
      options.key = key;
    }
  }

  if (by !== 'rstar' && by !== 'rstarverified') {
    options.platform = platform;
  }

  if (limit) {
    options.limit = Number(limit);
  }

  if (skip) {
    options.skip = Number(skip);
  }

  try {
    await fetchAndSave(options);
  } catch (error) {
    console.log('Error while fetch and save jobs:', error);
  }

  res.json({
    message: 'Jobs are being fetched.'
  });
};

async function jobFetchedPost(req, res) {

}
