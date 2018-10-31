const addDays = require('date-fns/add_days');
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
    return {
      error: 'Crew info do not need to be fetched',
    };
  }

  let crewInfo = await fetchCrew(slug);

  Object.assign(crewInfo, {
    lastInfoFetch: new Date(),
    nextFetch: addDays(new Date(), 7),
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
      fetchAllowed: false,
      nextFetch: new Date(),
    }).save()));
  }

  return {
    crewInfo,
  };
};
