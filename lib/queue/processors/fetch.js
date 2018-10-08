const fetchJob = require('../../jobs/fetch-job');
const fetchCrew = require('../../fetch-crew');
const fetchList = require('../../jobs/fetch-list');
const saveJob = require('../../jobs/save-job');
const {User} = require('../../../models');

async function fetchJobJob(data) {
  const {jobId} = data;

  if (!jobId || jobId.length !== 22) {
    throw new Error('Incorrect job ID');
  }

  const rgscJob = await fetchJob({jobId});
  const rawJob = await saveJob({rgscJob});

  return rawJob;
}

async function fetchUserJob(data) {
  const {
    rockstarId: userId,
    nickname: username,
    crewId,
  } = data.userInfo;

  const user = await User.findOne({username});

  const newUserInfo = {
    username,
    userId,
    crewId,
  };

  if (user) {
    user.set(newUserInfo);
  }

  const result = await (user || new User(newUserInfo)).save();

  return result;
}

module.exports = async job => {
  const {type, data} = job.data;

  let jobProcessor;

  switch (type) {
    case 'crew':
      jobProcessor = fetchCrew;
      break;

    case 'job':
      jobProcessor = fetchJobJob;
      break;

    case 'jobBunch':
      jobProcessor = fetchList;
      break;

    case 'user':
      jobProcessor = fetchUserJob;
      break;

    default:
      throw new Error('Unknown job subtype');
  }

  const result = await jobProcessor(data);

  return result;
};
