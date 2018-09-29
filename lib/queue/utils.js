const path = require('path');
const Queue = require('bull');

const JOB_MAX_ATTEMPTS = 15;

function createQueueWithDefaultParams(name) {
  return new Queue(name, {
    defaultJobOptions: {
      attempts: JOB_MAX_ATTEMPTS,
      backoff: {
        type: 'exponential',
        delay: 1000 * 10,
      },
    },

    settings: {
      maxStalledCount: Number.MAX_VALUE,
    },
  });
}

function addQueueProcessor(queue, processorName) {
  queue.process(
    processorName,
    path.resolve(__dirname, `processors/${processorName}.js`),
  );
}

function addRepeatableJob({queues, targetQueue, name, func, repeatEvery}) {
  targetQueue.process(name, func.bind(null, queues));

  targetQueue.add(name, null, {
    repeat: {
      every: repeatEvery,
    },
  });
}

module.exports = {
  createQueueWithDefaultParams,
  addQueueProcessor,
  addRepeatableJob,
};
