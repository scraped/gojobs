const updateCrewInfo = require('../../rgsc/update-crew-info');

module.exports = async job => {
  const {
    slug,
    save = true,
    createInfo = false,
  } = job.data;

  const {error, crewInfo} = await updateCrewInfo({slug, save, createInfo});

  if (error) {
    return {error};
  }

  return {crewInfo};
};
