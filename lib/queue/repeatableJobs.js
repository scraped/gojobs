const {RawJob, FetchInfo} = require('../../models');
const {addRepeatableJob} = require('./utils');

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
        jobId: `${jobId}_${new Date()}`,
      },
    );
  });

  return {
    found: jobs.length,
  };
}

async function checkNewJobs({fetchQueue}) {
  const entities = await FetchInfo.find({
    nextFetch: {
      $lte: new Date(),
    },
  });

  entities.forEach(entity => {
    const {type, id} = entity;

    let data = {
      type,
      id,
      jobId: {
        jobId: new Date(),
      },
    };

    fetchQueue.add(
      'fetch',
      {
        type: 'jobBunch',
        data,
      },
      {
        jobId: `newjobs_${new Date()}`,
      },
    );
  });

  return {
    toFetch: entities.length,
  };
}

async function checkJobsUpdates({fetchQueue}) {
  const jobs = await RawJob.find({
    nextFetch: {
      $lte: new Date(),
    },
  });

  jobs.forEach(rawJob => {
    const {jobId} = rawJob;

    fetchQueue.add(
      'job',
      {
        jobId,
      },
      {
        jobId: `${jobId}_${new Date()}`,
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
