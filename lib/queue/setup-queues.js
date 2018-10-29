const Arena = require('bull-arena');
const path = require('path');
const queueConfig = require('../../config/queue');
const repeatableJobs = require('./repeatable');

const mainProcessorPath = path.resolve(__dirname, 'processors/index.js');

module.exports = function setupQueues() {
  const {setupQueue, queueName} = queueConfig;

  const queue = setupQueue();

  console.log(queue);

  Arena({
    queues: [{
      name: queueName,
      hostId: 'Main Queue Server',
      host: '127.0.0.1',
    }],
  });

  repeatableJobs(queue);

  queue.process('*', mainProcessorPath);
};
