const {fetchJob, fetchJobBunch} = require('../../jobs/fetch');
const {saveJob} = require('../../jobs/save');
const {fetchAndSaveCrewInfo} = require('../../crew');
const {FetchInfo} = require('../../../models');

async function fetchCrewJob(data) {
  const {slug} = data;

  if (!slug) {
    throw new Error('Crew ID must be specified');
  }

  const crew = await fetchAndSaveCrewInfo({slug});

  return crew;
}

async function fetchJobJob(data) {
  const {jobId} = data;

  if (!jobId) {
    throw new Error('Job ID must be specified');
  }

  const rgscJob = await fetchJob({jobId});
  const rawJob = await saveJob({rgscJob});

  return rawJob;
}

async function fetchBunchJob(data) {
  const {
    type,
    id,
    offset = 0,
    since,
  } = data;

  const fetchInfo = await FetchInfo.findOne(data);

  if (!fetchInfo) {
    throw new Error('Fetching jobs for non-existing entity');
  }

  const {
    platform,
    offset: oldOffset,
    total: oldTotal,
  } = fetchInfo;

  const bunch = await fetchJobBunch({
    type,
    id,
    platform,
    offset,
  });

  // "bunch" can be an empty object
  const {
    Missions: missions = [],
    Total: total = 0,
    Count: count = 0,
  } = bunch;

  const notAllJobsFetchedPrimary = (oldTotal === -1)
    || (oldOffset < oldTotal);

  let maxUpdateDate = since || new Date(0);

  const notAllJobsFetchedFromTheDate = missions.every(mission => {
    const {pdate, cdate} = mission.Content.Metadata;
    const updateDate = pdate || cdate;
    if (updateDate > maxUpdateDate) {
      maxUpdateDate = updateDate;
    }
    return updateDate > since;
  });

  // We must fetch a next bunch of jobs only if:
  // (1) all jobs has already been fetched, and we fetch only its updates
  // (2) there is reason to believe that we have more than one page with updates
  const fetchNextBunch = !notAllJobsFetchedPrimary
    && since
    && notAllJobsFetchedFromTheDate;

  let fetchStatsUpdate = {
    lastFetch: new Date(),
    since: maxUpdateDate,
  };

  // You can trust "count" value only on the first page
  if (offset === 0) {
    fetchStatsUpdate.total = total;
    fetchStatsUpdate.futureSinceDate = maxUpdateDate;
  }

  const newFutureSinceDate = fetchStatsUpdate.futureSinceDate
    || fetchStats.futureSinceDate;

  if (notAllJobsFetched) {
    fetchStatsUpdate.offset = oldOffset + count;

    if (fetchStatsUpdate.offset >= oldTotal) {
      fetchStatsUpdate.since = newFutureSinceDate;
    }
  }

  if (since && !notAllJobsFetchedFromTheDate) {
    fetchStatsUpdate.since = newFutureSinceDate;
  }

  if (fetchStats.total === -1) {
    fetchStatsUpdate.firstFetch = new Date();
  }

  fetchStats.set(fetchStatsUpdate);

  await fetchStats.save();

  return {
    fetchNextBunch,
    bunch,
  };
}

module.exports = async job => {
  const {type, data} = job.data;

  let jobFunction;

  if (type === 'crew') {
    jobFunction = fetchCrewJob;
  } else if (type === 'job') {
    jobFunction = fetchJobJob;
  } else if (type === 'jobBunch') {
    jobFunction = fetchBunchJob;
  } else {
    throw new Error('Unknown job subtype');
  }

  const result = await jobFunction(data);

  return result;
};
