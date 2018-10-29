const updateCrewInfo = require('../../rgsc/update-crew-info');

module.exports = async function updateCrewInfoProcessor(job) {
  const {slug, save, createInfo} = job.data;

  const {crewInfo} = await updateCrewInfo({slug, save, createInfo});

  return {crewInfo};
};
