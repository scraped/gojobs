const difference = require('lodash/difference');
const {FetchInfo} = require('../models');

module.exports = async function boostrap() {
  const rockstarJobsFetchInfo = (await FetchInfo.find({
    type: 'rockstar',
  })) || [];

  const rockstarFetchInfoTypes = [
    'rockstar',
    'verified',
  ];

  const rockstarFetchInfoTypesToCreate = difference(
    rockstarFetchInfoTypes,
    rockstarJobsFetchInfo.map(({id}) => id),
  );

  await Promise.all(rockstarFetchInfoTypesToCreate.map(id => {
    return new FetchInfo({
      type: 'rockstar',
      id,
    }).save();
  }));
};
