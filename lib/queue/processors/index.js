const updateCrewInfoProcessor = require('./update-crew-info');

module.exports = async job => {
  const {name} = job;

  let jobProcessor;

  switch (name) {
    case 'update-crew-info':
      jobProcessor = updateCrewInfoProcessor;
      break;

    case 'update-job-info':
      // jobProcessor = fetchJobJob;
      break;

    case 'fetch-job-list-page':
      // jobProcessor = fetchList;
      break;

    case 'save-user':
      // jobProcessor = fetchUserJob;
      break;

    default:
      throw new Error('Unknown job type');
  }

  return await jobProcessor(job);
};
