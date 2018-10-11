const Joi = require('joi');
const Boom = require('boom');
const {fetchQueue} = require('../../lib/queue');
const {genJobName} = require('../../lib/queue/utils');

async function jobsFetchPost(req, res, next) {
  const {jobId} = req.body;

  const schema = Joi.string()
    .required()
    .length(22)
    .regex(/^[\w-]{22}$/);

  const {error} = Joi.validate(jobId, schema);

  if (error) {
    return next(Boom.badRequest(`Incorrect job ID: ${jobId}`));
  }

  fetchQueue.add(
    'fetch',
    {
      type: 'job',
      data: {
        jobId,
      },
    },
    {
      jobId: genJobName(jobId),
      priority: 10,
    },
  );

  res.json({
    message: `Job ${jobId} had beed added to the queue.`,
  });
}

module.exports = {
  jobsFetchPost,
};
