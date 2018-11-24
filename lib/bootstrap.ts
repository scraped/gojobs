import difference from 'lodash/difference';
import {connect as connectMongodb} from '../config/mongodb';
import '../config/redis';

const {FetchInfo} = require('../models');
const queueSetup = require('../lib/queue/queue-setup');

export async function bootstrap(): Promise<void> {
  await connectMongodb();

  // =======================
  // Setup queues server & frontend
  // =======================
  await queueSetup();

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
