const {
  fetchJobsAndSave,
  fetchJobsBunchesAndSave
} = require('../../lib/jobs');
const redisClient = require('../../lib/redis');

module.exports = {
  jobFetchPost
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

async function jobFetchPost(req, res) {
  const { category, id, platform, period, limit } = req.body;

  let options = {
    period,
    category: category || 'all',
    bLimit: limit
  };

  if (category === 'member' || category === 'crew') {
    options.id = id;
  }

  if (category !== 'rockstar' && category !== 'rstarverified') {
    options.platform = platform;
  }

  try {
    let total = 0;
    let failures = 0;
    let jobs = [];

    if (category === 'job') {
      ({ total, failures, jobs } = await fetchJobsAndSave({ jobId: id }));
    } else {
      ({ total, failures, jobs } = await fetchJobsBunchesAndSave(options));
    }

    console.log(`Job(s) fetched, total: ${total}, failures: ${failures}, quantity: ${jobs.length}, ids:`);

    jobs.forEach((jobId, i) => {
      console.log(`${i+1}) ${jobId}`);
    });
  } catch (error) {
    console.log('Job(s) not fetched, error:', error);
  }

  res.json({
    message: 'Jobs are being fetched.'
  });
};

async function jobFetchedPost(req, res) {

}
