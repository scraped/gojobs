const Arena = require('bull-arena');

const {
  createQueueWithDefaultParams,
  addQueueProcessor
} = require('./utils');

const queues = {
  fetchQueue: 'rgsc-fetcher',
  processQueue: 'jobs-processor'
};

const fetchQueue = createQueueWithDefaultParams(queues.fetchQueue);
const processQueue = createQueueWithDefaultParams(queues.processQueue)

// Arena will be served on port 4567 by default
Arena({
  queues: Object.keys(queues).map(key => ({
    name: queues[key],
    hostId: 'Main Queue Server',
    host: '127.0.0.1'
  }))
});

addQueueProcessor(fetchQueue, 'fetch');
addQueueProcessor(processQueue, 'process');

module.exports = {
  fetchQueue,
  processQueue
};
