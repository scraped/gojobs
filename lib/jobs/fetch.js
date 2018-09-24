const {platforms} = require('../../config/static');
const RgscFetcher = require('../RgscFetcher');

function genFetchJobBunchesQuery({
  type,
  id,
  offset = 0,
}) {
  let query = {
    onlyCount: 'false',
    SearchOptSort: 'CreatedDate',
    offset,
  };

  switch (type) {
    case 'all':
      query.SearchOptPublisher = 'members';
      break;

    case 'user':
      query.SearchOptPublisher = 'named';
      query.SearchOptNamed = id;
      break;

    case 'crew':
      query.SearchOptPublisher = `crew${id}`;
      break;

    case 'rockstar':
      if (id === 'rockstar') {
        query.SearchOptPublisher = 'rockstar';
      } else if (id === 'verified') {
        query.SearchOptPublisher = 'rstarverified';
      }
      break;

    default:
      query.SearchOptPublisher = type;
  }

  return query;
}

async function fetchJobBunch({
  plat = 'pc',
  type = 'rockstar',
  id,
  offset = 0,
}) {
  const possibleTypes = [
    'user',
    'crew',
    'rockstar',
  ];

  if (!possibleTypes.includes(type)) {
    throw new Error(`Type '${type}' does not exist`);
  }

  if (!id) {
    throw new Error('ID must be specified');
  }

  if (type === 'rockstar') {
    if (id !== 'rockstar' || id !== 'verified') {
      throw new Error('Invalid ID');
    }
  } else if (!platforms.plat) {
    throw new Error(`Platform '${plat}' does not exist`);
  }

  const http = new RgscFetcher(plat);

  const searchParams = genFetchJobBunchesQuery({type, id, offset});

  const jobBunch = (await http.fetch({
    url: '/games/gtav/ajax/search',
    method: 'post',
    data: searchParams,
  })).data || {};

  if (jobBunch.Error || !jobBunch.Missions) {
    throw new Error(`Error, got the following response: ${JSON.stringify(jobBunch)} for this search params: ${JSON.stringify(searchParams)}`);
  }

  return jobBunch;
}

async function fetchJob({jobId}) {
  const http = new RgscFetcher();

  const rawJob = (await http.fetch({
    url: '/games/gtav/ajax/mission',
    params: {missionid: jobId},
  })).data;

  if (!rawJob || !rawJob.MissionId) {
    throw new Error(`No data has been retrieved for ${jobId}`);
  }

  return rawJob;
}

module.exports = {
  fetchJob,
  fetchJobBunch,
};
