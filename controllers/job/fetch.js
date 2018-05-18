const {
  fetchJobsAndSave,
  fetchJobsBunchesAndSave
} = require('../../lib/jobs');
// const redisClient = require('../../lib/redis');

module.exports = {
  jobFetchPost,
  jobFetchExtendedPost
};

// async function fetchedListPost(req, res) {
//   const LIMIT = 10;

//   let list = [];
//   let cursorValue = '0', values;

//   while (list.length < LIMIT) {
//     [cursorValue, values] = await redisClient.scanAsync(cursorValue);
//     if (Number(cursorValue) === 0) {
//       break;
//     }
//     list.push(...(values || []));
//   }

//   if (list.length > LIMIT) {
//     list.length = LIMIT;
//   }
// }

async function jobFetchExtendedPost(req, res) {
  const { jobId, proxy } = req.body;

  const { result } = await fetchJobsAndSave({ jobId, proxy });

  console.log(`Job(s) fetched, results:`);

  result.forEach((res, i) => {
    console.log(`${i + 1}) ${res.jobId} ${res.success ? 'saved' : 'not saved'}`);
  });

  res.json({
    message: 'Job(s) fetched.'
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
    let total = 0;
    let result = [];

    if (category === 'job') {
      ({ total, result } = await fetchJobsAndSave({ jobId: id }));
    } else {
      ({ total, result } = await fetchJobsBunchesAndSave(options));
    }

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
