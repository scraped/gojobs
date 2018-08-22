const Arena = require('bull-arena');

const {
  createQueueWithDefaultParams,
  addQueueProcessor
} = require('./utils');

const queues = [
  'rgsc-jobs-fetcher'
];

const fetchQueue = createQueueWithDefaultParams('rgsc-jobs-fetcher');

// Arena will be served on port 4567 by default
Arena({
  queues: queues.map(queueName => ({
      name: queueName,
      hostId: 'Main Queue Server',
      host: '127.0.0.1'
    }))
});

addQueueProcessor(fetchQueue, 'fetchJob');
addQueueProcessor(fetchQueue, 'fetchCrewInfo');

module.exports = {
  fetchQueue
};
