const {RawJob, FetchInfo} = require('../../models');
const {addRepeatableJob} = require('./utils');

const DAY = 1000 * 60 * 60 * 24 * 3;

async function checkJobsToProcess({processQueue}) {
  const jobs = await RawJob.find({processed: false});

  jobs.forEach(rawJob => {
    const {jobId} = rawJob;

    processQueue.add(
      'process',
      {
        jobId,
      },
      {
        jobId,
      },
    );
  });

  return {
    found: jobs.length,
  };
}

async function checkNewJobs({fetchQueue}) {
  const entities = await FetchInfo.find({
    $or: [
      // Rockstar & rockstar verifieds
      {
        type: 'rockstar',
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
    const {type, id = '', platform = '', total, offset, since} = entity;

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

async function checkJobsUpdates({fetchQueue}) {
  const jobs = await RawJob.find({
    $or: [
      {
        'job.Metadata.cat': 'none',
        'job.stats': {$exists: false},
        lastFetch: {$lte: new Date() - DAY * 28},
      },
      {
        'job.Metadata.cat': 'none',
        'job.stats': {$exists: true},
        lastFetch: {$lte: new Date() - DAY * 7},
      },
      {
        'job.Metadata.cat': {$ne: 'none'},
        lastFetch: {$lte: new Date() - DAY},
      },
    ],
  });

  jobs.forEach(rawJob => {
    const {jobId} = rawJob;

    fetchQueue.add(
      'job',
      {
        jobId,
      },
      {
        jobId,
      },
    );
  });

  return {
    found: jobs.length,
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

  addRepeatableJob({
    queues,
    targetQueue: fetchQueue,
    name: 'checkJobsUpdates',
    func: checkJobsUpdates,
    repeatEvery: minutes(15),
  });
};
