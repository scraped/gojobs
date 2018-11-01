const checkJobsToProcess = require('./repeatable/check-jobs-to-process');
const checkNewJobs = require('./repeatable/check-new-jobs');
const checkJobsUpdates = require('./repeatable/chech-jobs-updates');
const cleanOldJobs = require('./repeatable/clean-old-jobs');

async function addRepeatableJob({queue, name, func, repeatEvery}) {
  queue.process(name, func.bind(null, queue));

  await queue.add(name, null, {
    repeat: {
      every: repeatEvery,
    },
  });
}

module.exports = async function addRepeatableJobs(queue) {
  const minutes = mins => 1000 * 60 * mins;

  const oldRepeatableJobs = await queue.getRepeatableJobs();

  await Promise.all(oldRepeatableJobs.map(job => {
    const {name, tz} = job;
    return queue.removeRepeatable(name, {every: tz});
  }));

  await Promise.all([
    addRepeatableJob({
      queue,
      name: 'Check jobs to process',
      func: checkJobsToProcess,
      repeatEvery: minutes(7),
    }),

    addRepeatableJob({
      queue,
      name: 'Check new jobs',
      func: checkNewJobs,
      repeatEvery: minutes(5),
    }),

    addRepeatableJob({
      queue,
      name: 'Check jobs updates',
      func: checkJobsUpdates,
      repeatEvery: minutes(10),
    }),

    addRepeatableJob({
      queue,
      name: 'Clean old jobs',
      func: cleanOldJobs,
      repeatEvery: minutes(20),
    }),
  ]);
};
