const {RawJob, FetchInfo} = require('../../models');
const {addRepeatableJob, genJobName} = require('./utils');

async function checkJobsToProcess({processQueue}) {
  const limit = 100;

  const jobs = await RawJob.find({processed: false})
    .limit(100);

  const jobIds = jobs.map(job => job.jobId);

  jobIds.forEach(jobId => {
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
    limit,
    jobIds,
  };
}

async function checkNewJobs({fetchQueue}) {
  const entities = await FetchInfo.find({
    nextFetch: {
      $lte: new Date(),
    },
  });

  const entitiesBasicInfo = entities.map(
    ({type, id, plat}) => ({type, id, plat}),
  );

  entitiesBasicInfo.forEach(({type, id, plat}) => {
    fetchQueue.add(
      'fetch',
      {
        type: 'jobBunch',
        data: {type, id, plat},
      },
      {
        jobId: genJobName(`newjobs_${type}_${id}_${plat || ''}`),
      },
    );
  });

  return {
    toFetch: entities.length,
    things: entitiesBasicInfo,
  };
}

async function checkJobsUpdates({fetchQueue}) {
  const limit = 50;

  const jobs = await RawJob.find({
    nextFetch: {
      $lte: new Date(),
    },
    deleted: {
      $ne: true,
    },
  }).limit(limit);

  const jobIds = jobs.map(job => job.jobId);

  jobIds.forEach(jobId => {
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
    limit,
    jobIds,
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
