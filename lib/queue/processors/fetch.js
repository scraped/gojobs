const findKey = require('lodash/findKey');
const {fetchJob, fetchJobBunch} = require('../../jobs/fetch');
const {saveJob} = require('../../jobs/save');
const {fetchAndSaveCrewInfo} = require('../../crew');
const {FetchInfo, Crew} = require('../../../models');
const {platforms} = require('../../../config/static');

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
  const {type, id, plat} = data;

  const fetchInfo = await FetchInfo.findOne({type, id, plat});

  if (!fetchInfo) {
    throw new Error('This user/crew jobs cannot be fetched');
  }

  const {
    offset,
    total: oldTotal,
    maxUpdateDate: oldMaxUpdateDate,
    prevMaxUpdateDate: oldPrevMaxUpdateDate,
    firstFetch,
    fetchOnlyNew,
  } = fetchInfo;

  const idFixed =
    type === 'crew' ? String((await Crew.findOne({slug: id})).crewId) : id;

  const bunch = await fetchJobBunch({
    type,
    id: idFixed,
    plat,
    offset,
  });

  let {
    Missions: missions = [],
    Total: newTotal = 0,
    Count: count = 0,
  } = bunch;

  if (missions.length) {
    const jobsHaveCorrectPlatforms = missions.every(mission => {
      const jobPrimaryPlat = mission.Content.Metadata.plat.toLowerCase();

      const jobActualPlat = findKey(platforms, currPlatInfo =>
        currPlatInfo.rs.includes(jobPrimaryPlat),
      );

      return jobPrimaryPlat === jobActualPlat;
    });

    if (!jobsHaveCorrectPlatforms) {
      missions = [];
      newTotal = 0;
      count = 0;
    }
  }

  const lastFetchDate = new Date();

  let fetchInfoUpdate = {
    lastFetch: lastFetchDate,
  };

  if (!firstFetch) {
    fetchInfoUpdate.firstFetch = lastFetchDate;
  }

  let newMaxUpdateDate = oldMaxUpdateDate;

  const notAllJobsFetchedFromTheDate = missions.every(mission => {
    const {pdate, cdate} = mission.Content.Metadata;
    const updateDate = pdate || cdate;
    if (updateDate > newMaxUpdateDate) {
      newMaxUpdateDate = updateDate;
    }
    return updateDate > oldPrevMaxUpdateDate;
  });

  if (offset === 0) {
    fetchInfoUpdate.maxUpdateDate = newMaxUpdateDate;
  }

  // Of course newTotal being 0 not on the 1st page with some jobs is nonsence
  if (offset === 0 || (offset !== 0 && newTotal && missions.length)) {
    fetchInfoUpdate.total = newTotal;
  }

  if (fetchOnlyNew && notAllJobsFetchedFromTheDate) {
    fetchInfoUpdate.offset = offset + count;
  }

  const allUpdatesFetched = fetchOnlyNew && !notAllJobsFetchedFromTheDate;

  if (allUpdatesFetched) {
    fetchInfoUpdate.offset = 0;
  }

  if (!fetchOnlyNew || allUpdatesFetched) {
    fetchInfoUpdate.prevMaxUpdateDate =
      fetchInfoUpdate.maxUpdateDate || oldMaxUpdateDate;
  }

  if (!fetchOnlyNew) {
    const newOffset = offset + count;

    fetchInfoUpdate.offset = newOffset;

    if (newOffset >= oldTotal) {
      fetchInfoUpdate.fetchOnlyNew = true;
      fetchInfoUpdate.offset = 0;
    }
  }

  fetchInfoUpdate.fetches = fetchInfo.fetches++;

  fetchInfo.set(fetchInfoUpdate);

  await fetchInfo.save();

  return {
    bunch,
  };
}

module.exports = async job => {
  const {type, data} = job.data;

  let jobProcessor;

  switch (type) {
    case 'crew':
      jobProcessor = fetchCrewJob;
      break;

    case 'job':
      jobProcessor = fetchJobJob;
      break;

    case 'jobBunch':
      jobProcessor = fetchBunchJob;
      break;

    default:
      throw new Error('Unknown job subtype');
  }

  const result = await jobProcessor(data);

  return result;
};
