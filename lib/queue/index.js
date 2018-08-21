const path = require('path');
const Queue = require('bull');
const Arena = require('bull-arena');

const resolve = name => path.resolve(__dirname, name);

const fetchQueue = new Queue('rgsc-fetcher', {
  defaultJobOptions: {
    backoff: {
      type: 'exponential',
      delay: 10 * 1000
    }
  }
});

// Arena will be served on port 4567 by default
Arena({
  queues: [
    {
      name: 'rgsc-fetcher',
      hostId: 'Main Queue Server',
      host: '127.0.0.1'
    }
  ]
});

[
  'fetchJobBunches',
  'fetchCrewInfo',
  'fetchJob'
].forEach(processsorName => {
  fetchQueue.process(processsorName, resolve(`${processsorName}Processor.js`));
});

module.exports = {
  fetchQueue
};
