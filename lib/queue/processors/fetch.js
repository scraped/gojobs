const {fetchJob, fetchJobBunch} = require('../../jobs/fetch');
const {saveJob} = require('../../jobs/save');
const {fetchAndSaveCrewInfo} = require('../../crew');
const {FetchStats} = require('../../../models');

module.exports = async job => {
  const {type, data} = job.data;

  if (type === 'crew') {
    console.log('crew processor', data);

    const {slug} = data;

    if (!slug) {
      throw new Error('Crew ID must be specified');
    }

    const crew = await fetchAndSaveCrewInfo({slug});

    return crew;

  } else if (type === 'job') {
    console.log('job processor', data);

    const {jobId} = data;

    if (!jobId) {
      throw new Error('Job ID must be specified');
    }

    try {
      const rgscJob = await fetchJob({jobId});

      const rawJob = await saveJob({rgscJob});

      return rawJob;
    } catch (error) {
      console.log('job processor ERROR');
      throw error;
    }

  } else if (type === 'jobBunch') {
    console.log('jobBunch processor', data);

    const {
      category,
      id,
      platform,
      since,
      offset = 0
    } = data;

    let query = {
      category,
      platform
    };

    if (category === 'crew') query.crewId = id;
    if (category === 'user') query.username = id;

    const fetchStats = await FetchStats.findOne(query);

    if (!fetchStats) {
      throw new Error('Fetching jobs for non-existing entity');
    }

    let bunch;

    try {
      bunch = await fetchJobBunch({
        category,
        id,
        platform,
        offset
      });
    } catch (error) {
      console.log('jobBunch processor ERROR');
      throw error;
    }

    // "bunch" can be an empty object
    const {
      Missions: missions = [],
      Total: total = 0,
      Count: count = 0
    } = bunch;

    const {
      offset: oldOffset,
      total: oldTotal
    } = fetchStats;

    const notAllJobsFetched = (oldTotal === -1)
      || (oldOffset < oldTotal);

    let maxUpdateDate = since;

    const notAllJobsFetchedFromTheDate = missions.every(mission => {
      const {pdate, cdate} = mission.Content.Metadata;
      const updateDate = pdate || cdate;
      if (updateDate > maxUpdateDate) {
        maxUpdateDate = updateDate;
      }
      return updateDate > since;
    });

    const fetchNextBunch = since
      && !notAllJobsFetched
      && notAllJobsFetchedFromTheDate;

    let fetchStatsUpdate = {
      lastFetch: new Date(),
      since: maxUpdateDate
    };

    // You can trust count value only on the first page
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
      bunch
    };
  }
};

process.on('unhandledRejection', err => {
  console.log('Unhandled rejection occured in fetch:', err.stack);
  process.exit(1);
});
