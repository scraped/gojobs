const difference = require('lodash/difference');
const {FetchInfo} = require('../models');
const {createRedisClient} = require('./redis');
const setupQueues = require('../lib/queue/setup-queues');

module.exports = async function boostrap() {
  // =======================
  // Setup redis client
  // =======================
  createRedisClient();

  // =======================
  // Setup queues server & frontend
  // =======================
  setupQueues();

  // =======================
  // Rockstar jobs' stats documents
  // =======================
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
