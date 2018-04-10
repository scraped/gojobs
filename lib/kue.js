const { kuePort } = require('../config');
const kue = require('kue');

let queue = kue.createQueue({
  redis: {
    db: 1
  }
});

kue.app.listen(kuePort);
kue.app.set('title', 'Kue jobs - GTA Online Jobs');

queue.on('error', err => {
  console.log('Kue error occured:\n', err);
});

exports.queue = queue;
