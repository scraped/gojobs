const difference = require('lodash/difference');
const {FetchInfo} = require('../models');
const {createRedisClient} = require('./redis');
const queueSetup = require('../lib/queue/queue-setup');

module.exports = async function bootstrap() {
  // =======================
  // Setup redis client
  // =======================
  createRedisClient();

  // =======================
  // Setup queues server & frontend
  // =======================
  queueSetup();

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

  await Promise.all(
    rockstarFetchInfoTypesToCreate.map(id => new FetchInfo({
      type: 'rockstar',
      id,
      fetchAllowed: true,
    }).save()),
  );
};
