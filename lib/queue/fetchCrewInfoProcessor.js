const Crew = require('../../models/crew');
const {fetchCrewInfo} = require('../crew');

const CREW_INFO_NEXT_FETCH_AFTER = 60 * 60 * 24 * 7;

async function performJob(data) {
  const {slug} = data;

  let crew;

  try {
    crew = await Crew.findOne({slug});
  } catch (error) {
    console.log('error occured:', error);
  }

  console.log('here 2')

  if (crew && crew.lastInfoFetch - new Date() < CREW_INFO_NEXT_FETCH_AFTER) {
    throw new Error('Don\'t need to be fetched');
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
  return performJob(job.data).then(crew => crew);
};
