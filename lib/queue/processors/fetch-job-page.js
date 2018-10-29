const snakeCase = require('lodash/snakeCase');
const fetchList = require('../../rgsc/fetch-list');
const {queue} = require('../../../config/queue');

module.exports = async job => {
  const {type, id, plat} = job.data;

  const {response} = await fetchList({type, id, plat});

  const {
    items: jobs,
    crews,
    users,
  } = response.content;

  jobs.forEach(({id: jobId}) => {
    queue.add('update-job-info', {jobId}, {jobId});
  });

  Object.keys(crews).forEach(key => {
    const slug = snakeCase(crews[key].name);

    queue.add(
      'update-crew-info',
      {
        slug,
        save: true,
        createInfo: true,
      },
      {jobId: slug},
    );
  });

  Object.keys(users).forEach(key => {
    const userInfo = users[key];
    const {nickname} = userInfo;

    queue.add('update-user-info', {userInfo}, {jobId: nickname});
  });
};
