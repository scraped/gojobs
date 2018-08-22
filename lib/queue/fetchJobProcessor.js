const {RgscHttpClient} = require('../jobs/http');

async function performJob(job) {
  const http = new RgscHttpClient();

  await http.getCredentials();

  await job.progress(50);

  const {jobId} = job.data;

  let response = await http.fetcher({
    url: '/games/gtav/ajax/mission',
    params: { missionid: jobId }
  });

  let jobInfo = response.data;

  if (!jobInfo || !jobInfo.MissionId) {
    throw new Error('No data was received');
  }

  await job.progress(100);

  return jobInfo;
}

module.exports = job => {
  return performJob(job);
};
