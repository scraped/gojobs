const {fetchJob} = require('../../jobs/fetch-job');
const fetchCrew = require('../../fetch-crew');
const fetchList = require('../../jobs/fetch-list');
const {saveJob} = require('../../jobs/save-job');

async function fetchCrewJob(data) {
  const {slug} = data;

  if (!slug) {
    throw new Error('Crew ID must be specified');
  }

  const crew = await fetchCrew({slug});

  return crew;
}

async function fetchJobJob(data) {
  const {jobId} = data;

  if (!jobId) {
    throw new Error('Job ID must be specified');
  }

  const rgscJob = await fetchJob({jobId});
  const rawJob = await saveJob({rgscJob});

  return rawJob;
}

module.exports = async (job) => {
  const {type, data} = job.data;

  let jobProcessor;

  switch (type) {
    case 'crew':
      jobProcessor = fetchCrewJob;
      break;

    case 'job':
      jobProcessor = fetchJobJob;
      break;

    case 'jobBunch':
      jobProcessor = fetchList;
      break;

    default:
      throw new Error('Unknown job subtype');
  }

  const result = await jobProcessor(data);

  return result;
};
