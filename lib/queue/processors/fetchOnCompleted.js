const snakeCase = require('lodash/snakeCase');
const {genJobName} = require('../utils');

module.exports = ({fetchQueue}) => (job, result) => {
  const {type} = job.data;

  if (type !== 'jobBunch') {
    return;
  }

  const {
    items: jobs,
    crews,
    users,
  } = result.content;

  jobs.forEach(({id: jobId}) => {
    fetchQueue.add(
      'fetch',
      {
        type: 'job',
        data: {
          jobId,
        },
      },
      {
        jobId: genJobName(jobId),
      },
    );
  });

  crews.forEach(({name}) => {
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

  users.forEach(userInfo => {
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
