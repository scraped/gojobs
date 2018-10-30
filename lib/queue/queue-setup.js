const Arena = require('bull-arena');
const path = require('path');
const repeatableJobs = require('./repeatable');
const {queue} = require('./queue');

module.exports = function queueSetup() {
  const mainProcessorPath = path.resolve(__dirname, 'processors/index.js');

  queue.process('*', mainProcessorPath);
  repeatableJobs(queue);

  Arena({
    queues: [{
      name: queue.name,
      hostId: 'Main Queue Server',
      host: '127.0.0.1',
    }],
  });
};
