const {platforms} = require('../../config/static');
const {JobFetcher, JobListFetcher} = require('../fetchers');

async function fetchJobBunch({
  plat = 'pc',
  type = 'rockstar',
  id,
  offset = 0
}) {
  const possibleTypes = ['user', 'crew', 'rockstar'];
  const rockstarIds = ['rockstar', 'verified'];

  if (!possibleTypes.includes(type)) {
    throw new Error(`Type '${type}' does not exist`);
  }

  if (!id) {
    throw new Error('ID must be specified');
  }

  if (type === 'rockstar') {
    if (rockstarIds.includes(id)) {
      throw new Error('Invalid ID');
    }
  } else if (!platforms.plat) {
    throw new Error(`Platform '${plat}' does not exist`);
  }

  const http = new JobListFetcher();

  const searchParams = genFetchJobBunchesQuery({type, id, offset });

  const jobBunch = (await http.fetch({
      url: '/games/gtav/ajax/search',
      method: 'post',
      data: searchParams,
    })).data || {};

  if (jobBunch.Error || !jobBunch.Missions) {
    throw new Error(
      `Error, got the following response: ${JSON.stringify(jobBunch)} for this search params: ${JSON.stringify(searchParams)}`,
    )
  }

  return jobBunch;
}

async function fetchJob({jobId}) {
  const http = new JobFetcher();

  const rawJob = (await http.fetch({jobId})).data;

  if (!rawJob || !rawJob.MissionId) {
    throw new Error(`No data has been retrieved for ${jobId}`);
  }

  return rawJob;
}

module.exports = {
  fetchJob,
  fetchJobBunch,
};
