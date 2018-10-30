module.exports = {
  queueName: 'main-queue',

  queueOptions: {
    limiter: {
      max: 1,
      duration: 5000,
    },

    settings: {
      maxStalledCount: Number.MAX_SAFE_INTEGER,
    },
  },
};
