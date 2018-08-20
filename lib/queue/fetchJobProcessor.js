const {RgscHttpClient} = require('../jobs/http');

async function performJob(data) {
  const http = new RgscHttpClient();

  const credentials = await http.getCredentials();

  if (!credentials) {
    throw new Error('HTTP request cannot be performed as the necessary credentials cannot be fetched');
  }

  const {jobCurrId} = data;

  let response = await http.fetcher({
    url: '/games/gtav/ajax/mission',
    params: { missionid: jobCurrId }
  });

  let jobInfo = response.data;

  if (!jobInfo || !jobInfo.MissionId) {
    throw new Error('No data was fetched');
  }

  const {
    latest: latestVersion,
    latestVersionContentId,
    RootContentId,
    cat: category
  } = jobInfo.Content.Metadata;

  if (!latestVersion) {
    fetchResult.jobCurrId = latestVersionContentId;
    fetchResult.status = 'NOT_LATEST';
    return;
  }

  // No "stats" object and non-rockstar job
  if (!jobObject.Content.stats && category === 'none') {
    fetchResult.status = 'NO_STATS_PROPERTY';
  }




}

module.exports = job => {
  return performJob(job.data);
};
