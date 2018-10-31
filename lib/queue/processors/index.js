const updateCrewInfo = require('./update-crew-info');
const updateJobInfo = require('./update-job-info');
const fetchJobPage = require('./fetch-job-page');
const updateUserInfo = require('./update-user-info');
const processRawJob = require('./process-raw-job');

module.exports = async job => {
  const {name} = job;

  let jobProcessor;

  switch (name) {
    case 'update-crew-info':
      jobProcessor = updateCrewInfo;
      break;

    case 'update-job-info':
      jobProcessor = updateJobInfo;
      break;

    case 'fetch-job-page':
      jobProcessor = fetchJobPage;
      break;

    case 'process-raw-job':
      jobProcessor = processRawJob;
      break;

    case 'update-user-info':
      jobProcessor = updateUserInfo;
      break;

    default:
      throw new Error('Unknown job type');
  }

  console.log(`Job "${name}" added to the queue`);

  return await jobProcessor(job);
};
