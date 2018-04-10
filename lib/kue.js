const kue = require('kue');

let queue = kue.createQueue({
  redis: {
    db: 1
  }
});

queue.on('error', err => {
  console.log('Kue error occured:\n', err);
});

exports.queue = queue;
