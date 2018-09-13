const Arena = require('bull-arena');
const repeatableJobs = require('./repeatableJobs');
const fetchOnCompleted = require('./processors/fetchOnCompleted');

const {
  createQueueWithDefaultParams,
  addQueueProcessor
} = require('./utils');

const queuesNames = {
  fetchQueue: 'rgsc-fetcher',
  processQueue: 'jobs-processor'
};

const fetchQueue = createQueueWithDefaultParams(queuesNames.fetchQueue);
const processQueue = createQueueWithDefaultParams(queuesNames.processQueue)

// Arena will be served on port 4567 by default
Arena({
  queues: Object.keys(queuesNames).map(key => ({
    name: queuesNames[key],
    hostId: 'Main Queue Server',
    host: '127.0.0.1'
  }))
});

// Adding processors
addQueueProcessor(fetchQueue, 'fetch');
addQueueProcessor(processQueue, 'process');

const queues = {
  fetchQueue,
  processQueue
};

// Adding event handlers
fetchQueue.on('completed', fetchOnCompleted(queues));

// Adding repeatable jobs
repeatableJobs(queues);

module.exports = queues;
