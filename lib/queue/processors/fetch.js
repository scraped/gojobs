const {fetchJob} = require('../../jobs/fetch');
const {saveJob} = require('../../jobs/save');

async function performJob(job) {
  const {type, data} = job.data;

  if (type === 'fetchCrewInfo') {

//

  } else if (type === 'fetchJob') {
    const {jobId} = data;

    const rgscJob = await fetchJob({jobId});
    const rawJob = await saveJob({rgscJob});

    return rawJob;
  } else if (type === 'fetchJobBunch') {

//

  }
}

module.exports = job => {
  return performJob(job);
};
