const random = require('lodash/random');

module.exports = {
  queueName: 'main-queue',

  queueOptions: {
    settings: {
      backoffStrategies: {
        // 10-60 mins
        jitter() {
          return 1000 * 60 * (10 + random(0, 60));
        },
      },
    },

    limiter: {
      max: 1,
      duration: 500,
    },

    defaultJobOptions: {
      attempts: 100,
      backoff: {
        type: 'jitter',
      },
    },
  },
};
