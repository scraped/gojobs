const {RgscHttpClient} = require('../jobs/http');

async function performJob(data) {
  const http = new RgscHttpClient();

  const credentials = await http.getCredentials();

  if (!credentials) {
    throw new Error('HTTP request cannot be performed as the necessary credentials cannot be fetched');
  }

  const {jobId} = data;

  let response = await http.fetcher({
    url: '/games/gtav/ajax/mission',
    params: { missionid: jobId }
  });

  let jobInfo = response.data;

  if (!jobInfo || !jobInfo.MissionId) {
    throw new Error('No data was fetched');
  }

  console.log(jobInfo);

  return jobInfo;
}

module.exports = job => {
  return performJob(job.data);
};
