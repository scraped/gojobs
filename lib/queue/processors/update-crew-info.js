const updateCrewInfo = require('../../rgsc/update-crew-info');

module.exports = async job => {
  const {
    slug,
    save = true,
    createInfo = false,
  } = job.data;

  const {crewInfo} = await updateCrewInfo({slug, save, createInfo});

  return {crewInfo};
};
