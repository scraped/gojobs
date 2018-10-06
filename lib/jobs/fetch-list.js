const {FetchInfo, User, Crew} = require('../../models');
const {platforms} = require('../../config/static');

async function fetchAndUpdateInfo({
  type,
  id,
  plat,
}) {
  const possibleTypes = ['user', 'crew', 'rockstar'];
  const rockstarIds = ['rockstar', 'verified'];

  if (!possibleTypes.includes(type)) {
    throw new Error(`Type "${type}" does not exist`);
  }

  if (!id) {
    throw new Error('ID must be specified');
  }

  const isRockstar = type === 'rockstar';

  if (isRockstar) {
    if (rockstarIds.includes(id)) {
      throw new Error('Invalid ID');
    }
  } else if (!platforms.plat) {
    throw new Error(`Platform '${plat}' does not exist`);
  }

  let fetchInfo = await FetchInfo.findOne({type, id, plat});

  if (!fetchInfo && (isRockstar
    || (type === 'user' && await User.findOne({username: id}))
    || (type === 'crew' && await Crew.findOne({slug: id}))
  )) {
    let newFetchInfoDocument = {type, id};

    if (!isRockstar) {
      newFetchInfoDocument.plat = plat;
    }

    fetchInfo = await new FetchInfo(newFetchInfoDocument);
  } else {
    throw new Error('Cannot find such a user or a crew');
  }
}

module.exports = {
  fetchAndUpdateInfo,
};
