const path = require('path');
const Queue = require('bull');

const JOB_MAX_ATTEMPTS = 15;

function createQueueWithDefaultParams(name) {
  return new Queue(name, {
    defaultJobOptions: {
      attempts: JOB_MAX_ATTEMPTS,
      backoff: {
        type: 'exponential',
        delay: 1000 * 10
      }
    }
  });
}

function addQueueProcessor(queue, processorName) {
  queue.process(
    processorName,
    path.resolve(__dirname, `processors/${processorName}.js`)
  );
}

module.exports = {
  createQueueWithDefaultParams,
  addQueueProcessor
};
