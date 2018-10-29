const Queue = require('bull');

module.exports = {
  queueName: 'main-queue',
  queue: null,
  setupQueue() {
    this.queue = new Queue(this.queueName, {
      defaultJobOptions: {
        attempts: 10,
        backoff: {
          type: 'exponential',
          delay: 1000 * 10,
        },
      },

      limiter: {
        max: 1,
        duration: 5000,
      },

      settings: {
        maxStalledCount: Number.MAX_SAFE_INTEGER,
      },
    });

    return this.queue;
  },
};
