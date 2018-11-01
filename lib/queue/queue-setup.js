const Arena = require('bull-arena');
const path = require('path');
const addRepeatableJobs = require('./add-repeatable-jobs');
const {queue} = require('./queue');

module.exports = async function queueSetup() {
  const mainProcessorPath = path.resolve(__dirname, 'processors/index.js');

  await addRepeatableJobs(queue);
  queue.process('*', mainProcessorPath);

  Arena({
    queues: [{
      name: queue.name,
      hostId: 'Main Queue Server',
      host: '127.0.0.1',
    }],
  });
};
