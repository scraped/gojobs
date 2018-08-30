const {fetchJob} = require('../../jobs/fetch');
const {saveJob} = require('../../jobs/save');
const {fetchAndSaveCrewInfo} = require('../../crew');

module.exports = async job => {
  const {type, data} = job.data;

  if (type === 'fetchCrewInfo') {

    const {slug} = data;

    return await fetchAndSaveCrewInfo({slug});

  } else if (type === 'fetchJob') {

    const {jobId} = data;

    const rgscJob = await fetchJob({jobId});
    const rawJob = await saveJob({rgscJob});

    return rawJob;

  } else if (type === 'fetchJobBunch') {

//

  }
};
