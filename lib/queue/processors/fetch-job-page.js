const fetchList = require('../../rgsc/fetch-list');
const {queue} = require('../queue');

module.exports = async job => {
  const {type, id, plat} = job.data;

  const {response} = await fetchList({type, id, plat});

  const jobs = response.content.items;

  jobs.forEach(({id: jobId}) => {
    queue.add('update-job-info', {jobId}, {jobId, platform: plat});
  });

  return {jobs};
};
