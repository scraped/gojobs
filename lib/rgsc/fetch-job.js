const {JobOldFormatFetcher} = require('../fetchers');

async function fetchJob({jobId, platform}) {
  const http = new JobOldFormatFetcher(platform);

  const rgscJob = (await http.fetch({jobId})).data;

  return rgscJob;
}

module.exports = fetchJob;
