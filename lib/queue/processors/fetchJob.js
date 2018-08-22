const {fetchJob} = require('../../jobs/fetch');
const {saveJob} = require('../../jobs/save');

async function performJob(job) {
  const {jobId} = job.data;

  const rgscJob = await fetchJob({jobId});

  const rawJob = await saveJob({rgscJob});

  return rawJob;
}

module.exports = job => {
  return performJob(job);
};
