const {RawJob, FetchInfo} = require('../../models');
const {addRepeatableJob, genJobName} = require('./utils');
const redisKeys = require('../../config/redis-keys');
const redisClient = require('../redis');

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

async function checkJobsToFetch({fetchQueue}) {
  const limit = 90;

  const updateJobs = await RawJob.find({
    nextFetch: {
      $lte: new Date(),
    },
    deleted: {
      $ne: true,
    },
  }).limit(limit);

  const updatesFound = updateJobs.length;

  const updateJobsIds = updateJobs.map(job => job.jobId);

  let newJobsIds = [];

  if (updatesFound < limit) {
    newJobsIds = (
      (await redisClient.smembersAsync(redisKeys.jobsToFetch)) || []
    ).slice(0, limit - updatesFound);
  }

  const jobIds = [
    ...updateJobsIds,
    ...newJobsIds,
  ];

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
    found: {
      updates: updatesFound,
      new: newJobsIds.length,
    },
    limit,
    jobIds,
  };
}

async function cleanOldJobs() {

}

module.exports = queues => {
  const minutes = mins => 1000 * 60 * mins;

  const {fetchQueue, processQueue} = queues;

  addRepeatableJob({
    queues,
    targetQueue: processQueue,
    name: 'Check jobs to process',
    func: checkJobsToProcess,
    repeatEvery: minutes(5),
  });

  addRepeatableJob({
    queues,
    targetQueue: fetchQueue,
    name: 'Check new jobs',
    func: checkNewJobs,
    repeatEvery: minutes(5),
  });

  addRepeatableJob({
    queues,
    targetQueue: fetchQueue,
    name: 'Check jobs to fetch',
    func: checkJobsToFetch,
    repeatEvery: minutes(10),
  });

  addRepeatableJob({
    queues,
    targetQueue: fetchQueue,
    name: 'Clean old jobs',
    func: cleanOldJobs,
    repeatEvery: minutes(30),
  });
};
