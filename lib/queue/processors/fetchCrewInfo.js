const {Crew} = require('../../../models');
const {fetchCrewInfo} = require('../../crew');

// 7 days
const CREW_INFO_NEXT_FETCH_AFTER = 1000 * 60 * 60 * 24 * 7;

async function performJob(job) {
  const {slug} = job.data;

  const crew = await Crew.findOne({slug});

  if (crew && new Date() - crew.lastInfoFetch < CREW_INFO_NEXT_FETCH_AFTER) {
    throw new Error('Crew info don\'t need to be fetched');
  }

  const crewInfo = {
    ...(await fetchCrewInfo({slug})),
    slug,
    lastInfoFetch: new Date()
  };

  if (crew) {
    crew.set(crewInfo);
  }

  await (crew || new Crew(crewInfo)).save();

  return crew;
}

module.exports = job => {
  return performJob(job);
};
