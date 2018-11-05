const Boom = require('boom');
const {queue} = require('../../lib/queue/queue');
const {validate} = require('../../validators');

exports.jobsFetchPost = async (req, res, next) => {
  const {jobId, type, id, plat} = req.body;

  if (!jobId || (!type && !id && !plat)) {
    return next(Boom.badRequest('Not enough data'));
  }

  if (jobId && (!validate('jobId', jobId) || !plat)) {
    return next(Boom.badRequest('Not enough data'));
  }

  if (jobId) {
    await queue.add(
      'update-job-info',
      {
        jobId,
        platform: plat,
      },
      {
        jobId: `update_${plat}_${jobId}`,
        priority: 10,
      },
    );
  } else {
    await queue.add(
      'fetch-job-page',
      {type, id, plat},
      {
        priority: 10,
      },
    );
  }

  return res.json({
    message: 'Job has been added to the queue',
  });
};
