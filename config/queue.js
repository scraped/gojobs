const Queue = require('bull');

module.exports = {
  queueName: 'main-task-queue',
  queue: new Queue(this.queueName, {
    limiter: {
      max: 1,
    },
    settings: {
      maxStalledCount: Number.MAX_SAFE_INTEGER,
    },
  }),
};
