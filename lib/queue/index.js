const path = require('path');
const Queue = require('bull');
const Arena = require('bull-arena');

function createQueueWithDefaultParams(name) {
  const JOB_MAX_ATTEMPTS = 10;

  return new Queue(name, {
    defaultJobOptions: {
      attempts: JOB_MAX_ATTEMPTS,
      backoff: {
        type: 'exponential',
        delay: 10 * 1000
      }
    }
  });
}

function addQueueProcessor(queue, processorName) {
  queue.process(
    processorName,
    path.resolve(__dirname, `${processorName}Processor.js`)
  );
}

const fetchJobQueue = createQueueWithDefaultParams('rgsc-jobs-fetcher');

// Arena will be served on port 4567 by default
Arena({
  queues: [
      'rgsc-jobs-fetcher'
    ].map(queueName => ({
        name: queueName,
        hostId: 'Main Queue Server',
        host: '127.0.0.1'
    }))
});

addQueueProcessor(fetchJobQueue, 'fetchJob');

// [
//   'fetchJobBunches',
//   'fetchCrewInfo',
//   'fetchJob'
// ].forEach(processsorName => {
//   fetchQueue.process(processsorName, resolve(`${processsorName}Processor.js`));
// });

module.exports = {
  fetchJobQueue
};
