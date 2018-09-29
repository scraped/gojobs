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
        lastFetch: {$lte: new Date() - DAY},
      },

      // Regular jobs by crews and users
      {
        plat: {$exist: true},

        $or: [
          {
            fetchOnlyNew: false,
          },
          {
            lastFetch: {$lte: new Date() - DAY * 3},
          },
        ],
      },
    ],
  });

  entities.forEach(entity => {
    const {type, id} = entity;

    let data = {
      type,
      id,
    };

    fetchQueue.add('fetch', {
      type: 'jobBunch',
      data,
    });
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
    repeatEvery: minutes(5),
  });

  addRepeatableJob({
    queues,
    targetQueue: fetchQueue,
    name: 'checkJobsUpdates',
    func: checkJobsUpdates,
    repeatEvery: minutes(15),
  });
};
