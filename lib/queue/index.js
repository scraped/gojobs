const Arena = require('bull-arena');
const {FetchStats} = require('../../models');

const {
  createQueueWithDefaultParams,
  addQueueProcessor
} = require('./utils');

// const checkNewJobs = require('./processors/checkNewJobs');

const queues = {
  fetchQueue: 'rgsc-fetcher',
  processQueue: 'jobs-processor'
};

const fetchQueue = createQueueWithDefaultParams(queues.fetchQueue);
const processQueue = createQueueWithDefaultParams(queues.processQueue)

// Arena will be served on port 4567 by default
Arena({
  queues: Object.keys(queues).map(key => ({
    name: queues[key],
    hostId: 'Main Queue Server',
    host: '127.0.0.1'
  }))
});

// Adding processors
addQueueProcessor(fetchQueue, 'fetch');
fetchQueue.process('checkNewJobs', async () => {
  const stats = await FetchStats.find({
    $or: [
      {
        count: -1
      },
      {
        lastFetch: { $lte: new Date() - 1000 * 60 * 60 * 24 * 3 }
      }
    ]
  });

  stats.forEach(entity => {
    const {
      crewId,
      username,
      category,
      platform,
      lastFetchMaxJobUpdateDate
    } = entity;

    const id = crewId || username || category;

    fetchQueue.add(
      'fetch',
      {
        type: 'jobBunch',
        data: {
          category,
          id,
          platform,
          since: lastFetchMaxJobUpdateDate
        }
      },
      {
        jobId: `checknew-${id}`
      }
    );
  });

  return true;
});

addQueueProcessor(processQueue, 'process');

// Adding event handlers
fetchQueue.on('completed', (job, result) => {
  const {type, data} = job.data;

  if (type === 'jobBunch') {
    const {id, offset} = data;
    const {fetchNextBunch, bunch} = result;

    bunch.forEach(job => {
      const jobId = job.MissionId;
      console.log(`${jobId} added to the queue`);
      fetchQueue.add(
        'fetch',
        {
          type: 'job',
          data: {
            jobId
          }
        },
        {
          jobId: jobId
        }
      );
    });

    if (fetchNextBunch) {
      fetchQueue.add(
        'fetch',
        {
          type: 'jobBunch',
          data: {
            ...data,
            offset: (offset || 0) + bunch.Count
          }
        },
        {
          jobId: `checknew-${id}`
        }
      );
    }
  }
});

// Adding repeatable jobs
const minutes = minutes => 1000 * 60 * minutes;

fetchQueue.add('checkNewJobs', null, {
  repeat: {
    every: minutes(1)
  }
});

module.exports = {
  fetchQueue,
  processQueue
};
