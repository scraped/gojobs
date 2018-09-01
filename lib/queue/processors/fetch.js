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

    if (!jobId) {
      throw new Error('Job ID must be specified');
    }

    const rgscJob = await fetchJob({jobId});
    const rawJob = await saveJob({rgscJob});

    return rawJob;

  } else if (type === 'jobBunch') {

    const {
      category,
      id,
      platform,
      since,
      offset
    } = data;

    let query = {
      category
    };

    if (category === 'crew') query.crewId = id;
    if (category === 'user') query.username = id;

    const fetchStats = await FetchStats.findOne(query);

    if (!fetchStats) {
      throw new Error('Fetching jobs for non-existing entity');
    }

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

    let maxUpdateDate = since;
    let fetchNextBunch = !since && missions.length;

    if (!fetchNextBunch && missions.length) {
      fetchNextBunch = missions.every(mission => {
        const {pdate, cdate} = mission.Content.Metadata;
        const updateDate = pdate || cdate;
        if (updateDate > maxUpdateDate) {
          maxUpdateDate = updateDate;
        }
        return updateDate > since;
      });
    }

    const {
      count: oldCount
    } = fetchStats;

    let fetchStatsUpdate = {
      count,
      lastFetch: new Date(),
      lastFetchMaxJobUpdateDate: maxUpdateDate
    };

    if (oldCount === -1) {
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
