const checkJobsToProcess = require('./check-jobs-to-process');
const checkNewJobs = require('./check-new-jobs');
const checkJobsUpdates = require('./chech-jobs-updates');
const cleanOldJobs = require('./clean-old-jobs');

function addRepeatableJob({queue, name, func, repeatEvery}) {
  queue.process(name, func.bind(null, queue));

  queue.add(name, null, {
    repeat: {
      every: repeatEvery,
    },
  });
}

module.exports = queue => {
  const minutes = mins => 1000 * 60 * mins;

  addRepeatableJob({
    queue,
    name: 'Check jobs to process',
    func: checkJobsToProcess,
    repeatEvery: minutes(5),
  });

  addRepeatableJob({
    queue,
    name: 'Check new jobs',
    func: checkNewJobs,
    repeatEvery: minutes(5),
  });

  addRepeatableJob({
    queue,
    name: 'Check jobs updates',
    func: checkJobsUpdates,
    repeatEvery: minutes(10),
  });

  addRepeatableJob({
    queue,
    name: 'Clean old jobs',
    func: cleanOldJobs,
    repeatEvery: minutes(20),
  });
};
