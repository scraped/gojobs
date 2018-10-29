const find = require('lodash/find');
const {Crew, FetchInfo} = require('../../models');
const {platforms} = require('../../config/static');
const fetchCrew = require('./fetch-crew');

module.exports = async function updateCrewInfo({
  slug,
  save = true,
  createInfo = false,
}) {
  const crew = await Crew.findOne({slug});

  if (save
    && crew
    && crew.nextFetch < new Date()) {
    throw new Error('Crew info do not need to be fetched');
  }

  let crewInfo = await fetchCrew(slug);

  Object.assign(crewInfo, {
    lastInfoFetch: new Date(),
  });

  const {isRockstar} = crewInfo;

  if (save) {
    if (crew) {
      crew.set(crewInfo);
    }

    await (crew || new Crew(crewInfo)).save();
  }

  if (createInfo && !isRockstar) {
    const platformsIds = Object.keys(platforms);

    const crewFetchInfo = await FetchInfo.find({
      type: 'crew',
      id: slug,
    });

    const platformsToAdd = platformsIds.filter(
      currPlatform => !find(
        crewFetchInfo,
        fetchInfo => fetchInfo.plat === currPlatform,
      ),
    );

    await Promise.all(platformsToAdd.map(currPlatform => new FetchInfo({
      type: 'crew',
      id: slug,
      plat: currPlatform,
      nextFetch: new Date(),
    }).save()));
  }

  return {
    crewInfo,
  };
};
