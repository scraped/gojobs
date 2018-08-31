const {fetchJob} = require('../../jobs/fetch');
const {saveJob} = require('../../jobs/save');
const {fetchAndSaveCrewInfo} = require('../../crew');

module.exports = async job => {
  const {type, data} = job.data;

  if (type === 'crew') {

    const {slug} = data;

    const crew = await fetchAndSaveCrewInfo({slug});

    return crew;

  } else if (type === 'job') {

    const {jobId} = data;

    const rgscJob = await fetchJob({jobId});
    const rawJob = await saveJob({rgscJob});

    return rawJob;

  } else if (type === 'jobBunch') {

//

  }
};
