const fetchList = require('../../rgsc/fetch-list');
const {queue} = require('../queue');

module.exports = async job => {
  const {type, id, plat} = job.data;

  const {fetchParams, response} = await fetchList({type, id, plat});

  const jobs = response.content.items;

  await Promise.all(jobs.map(
    ({id: jobId}) => queue.add(
      'update-job-info',
      {jobId, platform: plat},
      {jobId},
    ),
  ));

  return {
    fetchParams,
    response,
  };
};
