const { fetchAndSave } = require('../../lib/jobs');
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
