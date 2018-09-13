const {RawJob, FetchStats} = require('../../models');

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
  const stats = await FetchStats.find({
    platform: 'pc',
    $or: [
      {
        $where: 'this.total === -1 || (this.offset < this.total)'
      },
      {
        lastFetch: {
          $lte: new Date() - 1000 * 60 * 60 * 24 * 3
        }
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
}

module.exports = queues => {
  const {fetchQueue} = queues;

  fetchQueue.process(
    'checkJobsToProcess',
    checkJobsToProcess.bind(this, queues)
  );

  fetchQueue.process(
    'chechNewJobs',
    checkNewJobs.bind(this, queues)
  );

  const minutes = mins => 1000 * 60 * mins;

  fetchQueue.add('checkJobsToProcess', null, {
    repeat: {
      every: minutes(10)
    }
  });

  fetchQueue.add('checkNewJobs', null, {
    repeat: {
      every: minutes(3)
    }
  });
};
