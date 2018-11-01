const fetchJob = require('../../rgsc/fetch-job');
const saveJob = require('../../rgsc/save-job');
const {validate} = require('../../../validators');
const {queue} = require('../queue');

module.exports = async job => {
  const {jobId, platform} = job.data;

  if (!validate('jobId', jobId)) {
    throw new Error('Incorrect job ID');
  }

  const rgscJob = await fetchJob({jobId, platform});
  const rawJob = await saveJob({jobId, rgscJob, platform});

  const jobMetadata = rawJob.job.Metadata;

  const crewSlug = jobMetadata.crewSlug
    ? jobMetadata.crewSlug.split('/')[2]
    : '';

  const username = jobMetadata.originalCreatorName
    || jobMetadata.nickname;

  if (crewSlug) {
    await queue.add(
      'update-crew-info',
      {
        slug: crewSlug,
        save: true,
        createInfo: true,
      },
      {
        jobId: `crew_${crewSlug}`,
      },
    );
  }

  if (username) {
    const userId = jobMetadata.rockstarId;

    await queue.add(
      'update-user-info',
      {
        userId,
        username,
        crewSlug,
      },
      {
        jobId: `user_${username}`,
      },
    );
  }

  return {rawJob};
};
