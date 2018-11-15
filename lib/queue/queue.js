const Queue = require('bull');
const {redisUri} = require('../../config');
const {queueOptions, queueName} = require('../../config/queue');

exports.queue = new Queue(queueName, redisUri, queueOptions);
