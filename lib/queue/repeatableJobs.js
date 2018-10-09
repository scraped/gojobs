const {RawJob, FetchInfo} = require('../../models');
const {addRepeatableJob, genJobName} = require('./utils');

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
        jobId: genJobName(jobId),
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
    const {type, id, plat} = entity;

    fetchQueue.add(
      'fetch',
      {
        type: 'jobBunch',
        data: {type, id, plat},
      },
      {
        jobId: genJobName('newjobs'),
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
      'fetch',
      {
        type: 'job',
        data: {jobId},
      },
      {
        jobId: genJobName(jobId),
      },
    );
  });

  return {
    found: jobs.length,
  };
}

module.exports = queues => {
  const minutes = mins => 1000 * 60 * mins;

  const {fetchQueue, processQueue} = queues;

  addRepeatableJob({
    queues,
    targetQueue: processQueue,
    name: 'checkJobsToProcess',
    func: checkJobsToProcess,
    repeatEvery: minutes(10),
  });

  addRepeatableJob({
    queues,
    targetQueue: fetchQueue,
    name: 'chechNewJobs',
    func: checkNewJobs,
    repeatEvery: minutes(8),
  });

  addRepeatableJob({
    queues,
    targetQueue: fetchQueue,
    name: 'checkJobsUpdates',
    func: checkJobsUpdates,
    repeatEvery: minutes(45),
  });
};
