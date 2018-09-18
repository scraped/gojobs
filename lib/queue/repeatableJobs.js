const {RawJob, FetchInfo} = require('../../models');
const {addRepeatableJob} = require('./utils');

async function checkJobsToProcess({processQueue}) {
  const rawJobs = await RawJob.find({processed: false});

  rawJobs.forEach(rawJob => {
    const {jobId} = rawJob;

    processQueue.add(
      'process',
      {
        jobId
      },
      {
        jobId: jobId
      }
    );
  });

  return {
    jobsToProcess: rawJobs.length
  };
}

async function checkNewJobs({fetchQueue}) {
  const DAY = 1000 * 60 * 60 * 24 * 3;

  const entities = await FetchInfo.find({
    $or: [
      // Rockstar & rockstar verifieds
      {
        $or: [
          {type: 'rockstar'},
          {type: 'rockstarverified'},
        ],

        lastFetch: {$lte: new Date() - DAY * 1},
      },

      // Regular jobs by crews and users
      {
        platform: {$exist: true},

        $or: [
          {
            $where: 'this.total === -1 || (this.offset < this.total)',
          },
          {
            lastFetch: {$lte: new Date() - DAY * 3},
          },
        ],
      },
    ],
  });

  entities.forEach(entity => {
    const {
      type,
      id = '',
      platform = '',
      total,
      offset,
      since,
    } = entity;

    let key = '';

    let data = {
      type,
      id,
    };

    if (total === -1 || offset < total) {
      data.offset = offset;
      key = offset;
    } else {
      data.since = since;
      key = String(since.getTime());
    }

    fetchQueue.add(
      'fetch',
      {
        type: 'jobBunch',
        data,
      },
      {
        jobId: `bunch-${type}-${id}-${key}-${platform}`,
      },
    );
  });

  return {
    toFetch: entities.length,
  };
}

module.exports = queues => {
  const minutes = mins => 1000 * 60 * mins;

  const {fetchQueue} = queues;

  addRepeatableJob({
    queues,
    targetQueue: fetchQueue,
    name: 'checkJobsToProcess',
    func: checkJobsToProcess,
    repeatEvery: minutes(10),
  });

  addRepeatableJob({
    queues,
    targetQueue: fetchQueue,
    name: 'chechNewJobs',
    func: checkNewJobs,
    repeatEvery: minutes(3),
  });
};
