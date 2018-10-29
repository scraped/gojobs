const Arena = require('bull-arena');
const path = require('path');
const {queueName, queue} = require('../../config/queue');
const repeatableJobs = require('./repeatable');

Arena({
  queues: [{
    name: queueName,
    hostId: 'Main Queue Server',
    host: '127.0.0.1',
  }],
});

queue.process('*', path.resolve(__dirname, 'processors/index.js'));

repeatableJobs([queue]);

module.exports = {
  mainQueue: queue,
};
