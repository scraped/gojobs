const snakeCase = require('lodash/snakeCase');
const {genJobName} = require('../utils');
const redisKeys = require('../../../config/redis-keys');
const redisClient = require('../../redis');

module.exports = ({fetchQueue}) => async (job, result) => {
  const {type} = job.data;

  if (type !== 'jobBunch') {
    return;
  }

  const {
    items: jobs,
    crews,
    users,
  } = result.content;

  const jobIds = jobs.map(({id: jobId}) => jobId);

  await redisClient.saddAsync(redisKeys.jobsToFetch, ...jobIds);

  Object.keys(crews).forEach(key => {
    const {name} = crews[key];

    const slug = snakeCase(name);

    fetchQueue.add(
      'fetch',
      {
        type: 'crew',
        data: {
          slug,
        },
      },
      {
        jobId: genJobName(slug),
      },
    );
  });

  Object.keys(users).forEach(key => {
    const userInfo = users[key];

    fetchQueue.add(
      'fetch',
      {
        type: 'user',
        data: {
          userInfo,
        },
      },
      {
        jobId: genJobName(userInfo.nickname),
      },
    );
  });
};
