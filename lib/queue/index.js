const Arena = require('bull-arena');
const {FetchStats, RawJob} = require('../../models');

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

fetchQueue.process('checkJobsToProcess', async() => {
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
});

fetchQueue.process('checkNewJobs', async () => {
  const stats = await FetchStats.find({
    platform: 'pc',
    $or: [
      {
        $where: "this.total === -1 || (this.offset < this.total)"
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
      total,
      offset,
      since
    } = entity;

    const id = crewId || username || category;

    let data = {category, id, platform};

    let key = '';

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
        data
      },
      {
        jobId: `bunch-${category}-${id}-${key}-${platform}`
      }
    );
  });

  return {
    entitiesFound: stats.length
  };
});

addQueueProcessor(processQueue, 'process');

// Adding event handlers
fetchQueue.on('completed', (job, result) => {
  const {type, data} = job.data;

  if (type === 'jobBunch') {
    const {id, offset, category, platform} = data;
    const {fetchNextBunch, bunch} = result;

    if (!Object.keys(bunch).length) return;

    bunch.Missions.forEach(job => {
      const jobId = job.MissionId;
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
      const newOffset = (offset || 0) + bunch.Count;

      fetchQueue.add(
        'fetch',
        {
          type: 'jobBunch',
          data: {
            ...data,
            offset: newOffset
          }
        },
        {
          jobId: `bunch-${category}-${id}-${newOffset}-${platform}`
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

fetchQueue.add('checkJobsToProcess', null, {
  repeat: {
    every: minutes(1)
  }
});

module.exports = {
  fetchQueue,
  processQueue
};
