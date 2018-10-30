const {FetchInfo} = require('../../../models');

module.exports = async queue => {
  const entities = await FetchInfo.find({
    fetchAllowed: true,
    nextFetch: {
      $lte: new Date(),
    },
  });

  const entitiesBasicInfo = entities.map(
    ({type, id, plat}) => ({type, id, plat}),
  );

  entitiesBasicInfo.forEach(({type, id, plat}) => {
    queue.add(
      'fetch-job-page',
      {type, id, plat},
    );
  });

  return {
    found: entities.length,
    what: entitiesBasicInfo,
  };
};
