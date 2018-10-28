const path = require('path');
const Queue = require('bull');
const format = require('date-fns/format');

const JOB_MAX_ATTEMPTS = 12;

function createQueueWithDefaultParams(name) {
  return new Queue(name, {
    defaultJobOptions: {
      attempts: JOB_MAX_ATTEMPTS,
      backoff: {
        type: 'exponential',
        delay: 1000 * 10,
      },
    },
    limiter: {
      max: 1,
      duration: 1000,
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

function genJobName(id = '') {
  const formattedDate = format(new Date(), 'DD_MM_YYYY_HH_mm_ss');
  return `${id}__${formattedDate}`;
}

module.exports = {
  createQueueWithDefaultParams,
  addQueueProcessor,
  addRepeatableJob,
  genJobName,
};
