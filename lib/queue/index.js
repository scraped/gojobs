const Arena = require('bull-arena');
const repeatableJobs = require('./repeatableJobs');
const fetchOnCompleted = require('./processors/fetchOnCompleted');

const {
  createQueueWithDefaultParams,
  addQueueProcessor
} = require('./utils');

// const checkNewJobs = require('./processors/checkNewJobs');

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

// Adding processors
addQueueProcessor(fetchQueue, 'fetch');

addQueueProcessor(processQueue, 'process');

// Adding event handlers
fetchQueue.on('completed', fetchOnCompleted({fetchQueue}));

// Adding repeatable jobs
repeatableJobs({fetchQueue, processQueue});

module.exports = {
  fetchQueue,
  processQueue
};
