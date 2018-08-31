const {fetchJob, fetchJobBunches} = require('../../jobs/fetch');
const {saveJob} = require('../../jobs/save');
const {fetchAndSaveCrewInfo} = require('../../crew');
const {FetchStats} = require('../../../models');

module.exports = async job => {
  const {type, data} = job.data;

  if (type === 'crew') {

    const {slug} = data;

    const crew = await fetchAndSaveCrewInfo({slug});

    return crew;

  } else if (type === 'job') {

    const {jobId} = data;

    const rgscJob = await fetchJob({jobId});
    const rawJob = await saveJob({rgscJob});

    return rawJob;

  } else if (type === 'jobBunch') {

    let query = {
      category
    };

    if (category === 'crew') query.crewId = id;
    if (category === 'user') query.username = id;

    const fetchStats = await FetchStats.find(query);

    if (!fetchStats) {
      throw new Error('Fetching jobs for non-existing entity');
    }

    const {
      category,
      id,
      platform,
      since,
      offset
    } = data;

    const bunch = await fetchJobBunches({
      category,
      id,
      platform,
      offset
    });

    const {
      Missions: missions,
      Total: count
    } = bunch;

    let fetchNextBunch = !since && missions.length;

    if (!fetchNextBunch) {
      fetchNextBunch = missions.every(mission => {
        const {pdate, cdate} = mission.Content.Metadata;
        const updateDate = pdate || cdate;
        return updateDate < since;
      });
    }

    const {
      count: oldCount,
      lastFetchMaxJobUpdateDate
    } = fetchStats;

    let fetchStatsUpdate = {
      count,
      lastFetch: new Date()
    };

    if (oldCount === -1) {
      fetchStatsUpdate.firstFetch = new Date();
    }

    return {
      fetchNextBunch,
      bunch
    };
  }
};
