const {JobFetcher} = require('../fetchers');

async function fetchJob({jobId}) {
  const http = new JobFetcher();

  const rgscJob = (await http.fetch({jobId})).data;

  return rgscJob;
}

module.exports = fetchJob;
