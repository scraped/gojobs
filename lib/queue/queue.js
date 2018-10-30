const Queue = require('bull');
const {queueOptions, queueName} = require('../../config/queue');

exports.queue = new Queue(queueName, queueOptions);
