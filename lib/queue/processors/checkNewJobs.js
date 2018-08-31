const {FetchStats} = require('../../../models');
const {fetchQueue} = require('../');

module.exports = async () => {
  const stats = await FetchStats.find({
    $or: [
      {
        count: -1
      },
      {
        lastFetch: { $lte: new Date() - 1000 * 60 * 60 * 24 * 3 }
      }
    ]
  });

  stats.forEach(entity => {
    const {
      crewId,
      username,
      category,
      platform,
      lastFetchMaxJobUpdateDate
    } = entity;

    const id = crewId || username || category;

    fetchQueue.add(
      'fetch',
      {
        type: 'jobBunch',
        data: {
          category,
          id,
          platform,
          since: lastFetchMaxJobUpdateDate
        }
      },
      {
        jobId: `checknew-${id}`
      }
    );
  });

  return true;
};
