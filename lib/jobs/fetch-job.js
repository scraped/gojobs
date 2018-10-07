const {JobFetcher} = require('../fetchers');

async function fetchJob({jobId}) {
  const http = new JobFetcher();

  const rgscJob = (await http.fetch({jobId})).data;

  if (!rgscJob || !rgscJob.MissionId) {
    throw new Error(`No data has been retrieved for ${jobId}`);
  }

  return rgscJob;
}

module.exports = fetchJob;
