const Boom = require('boom');
const {queue} = require('../../lib/queue/queue');
const {validate} = require('../../validators');

exports.jobsFetchPost = (req, res, next) => {
  const {jobId} = req.body;

  if (!validate('jobId', jobId)) {
    return next(Boom.badRequest(`Incorrect job ID: ${jobId}`));
  }

  queue.add('update-job-info', {jobId}, {jobId, priority: 10});

  return res.json({
    message: `Job ${jobId} had beed added to the queue.`,
  });
};
