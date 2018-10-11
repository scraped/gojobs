const addDays = require('date-fns/add_days');
const isFuture = require('date-fns/is_future');
const {FetchInfo, User, Crew} = require('../../models');
const {platforms} = require('../../config/static');
const {JobListFetcher} = require('../fetchers');

async function fetchList({
  type,
  id,
  plat,
}) {
  const possibleTypes = ['user', 'crew', 'rockstar'];
  const rockstarIds = ['rockstar', 'verified'];

  if (!possibleTypes.includes(type)) {
    throw new Error(`Type "${type}" does not exist`);
  }

  if (!id) {
    throw new Error('ID must be specified');
  }

  const isRockstar = type === 'rockstar';

  if (isRockstar) {
    if (rockstarIds.includes(id)) {
      throw new Error('Invalid ID');
    }
  } else if (!platforms[plat]) {
    throw new Error(`Platform '${plat}' does not exist`);
  }

  let fetchParams = {type, id};

  if (!isRockstar) {
    fetchParams.plat = plat;
  }

  let fetchInfo = await FetchInfo.findOne(fetchParams);

  if (fetchInfo
    && isFuture(fetchInfo.nextFetch)) {
    throw new Error(`Next fetch should be made at ${fetchInfo.nextFetch}`);
  }

  if (!fetchInfo) {
    if (isRockstar
      || (type === 'user' && await User.findOne({username: id}))
      || (type === 'crew' && await Crew.findOne({slug: id}))
    ) {
      fetchInfo = await (new FetchInfo(fetchParams)).save();
    } else {
      throw new Error('Cannot find such a user or a crew');
    }
  }

  const {
    offset,
    maxUpdateDate: oldMaxUpdateDate,
    prevMaxUpdateDate: oldPrevMaxUpdateDate,
    firstFetch,
    fetchOnlyNew,
    fetches: oldFetches,
  } = fetchInfo;

  const fetcher = new JobListFetcher();

  const actualId = type === 'crew'
    ? (await Crew.findOne({slug: id})).crewId
    : id;

  const {data: response} = await fetcher.fetch({
    ...fetchParams,
    id: actualId,
    pageIndex: offset,
  });

  console.log(response);

  const {
    total,
    hasMore,
    status,
  } = response;

  const jobList = response.content.items;

  if (!status) {
    throw new Error(`Could not fetch jobs, got the following response: ${response}`);
  }

  const currFetchDate = new Date();

  let fetchInfoUpdate = {
    lastFetch: currFetchDate,
    total,
  };

  if (!firstFetch) {
    fetchInfoUpdate.firstFetch = currFetchDate;
  }

  let newMaxUpdateDate = oldMaxUpdateDate;

  const notAllJobsFetchedFromTheDate = jobList.every(({createdDate}) => {
    if (createdDate > newMaxUpdateDate) {
      newMaxUpdateDate = createdDate;
    }
    return createdDate > oldPrevMaxUpdateDate;
  });

  if (offset === 0) {
    fetchInfoUpdate.maxUpdateDate = newMaxUpdateDate;
  }

  let fetchNeededRightNow = false;

  if (fetchOnlyNew && notAllJobsFetchedFromTheDate) {
    fetchInfoUpdate.offset = offset + 1;
    fetchNeededRightNow = true;
  }

  const allUpdatesFetched = fetchOnlyNew && !notAllJobsFetchedFromTheDate;

  if (allUpdatesFetched) {
    fetchInfoUpdate.offset = 0;
  }

  if (!fetchOnlyNew || allUpdatesFetched) {
    fetchInfoUpdate.prevMaxUpdateDate = fetchInfoUpdate.maxUpdateDate
      || oldMaxUpdateDate;
  }

  if (!fetchOnlyNew) {
    fetchInfoUpdate.offset = offset + 1;

    if (hasMore) {
      fetchNeededRightNow = true;
    } else {
      fetchInfoUpdate.fetchOnlyNew = true;
      fetchInfoUpdate.offset = 0;
    }
  }

  const nextFetchDays = isRockstar
    ? 1
    : 3;

  const nextFetch = fetchNeededRightNow
    ? new Date()
    : addDays(new Date(), nextFetchDays);

  Object.assign(fetchInfoUpdate, {
    fetches: oldFetches + 1,
    nextFetch,
  });

  fetchInfo.set(fetchInfoUpdate);

  await fetchInfo.save();

  return response;
}

module.exports = fetchList;
