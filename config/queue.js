module.exports = {
  queueName: 'main-queue',

  queueOptions: {
    defaultJobOptions: {
      attempts: 10,
      backoff: {
        type: 'exponential',
        delay: 1000 * 10,
      },
    },

    limiter: {
      max: 1,
      duration: 3000,
      bounceBack: true,
    },

    settings: {
      maxStalledCount: Number.MAX_SAFE_INTEGER,
    },
  },
};
