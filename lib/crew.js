const {Crew} = require('../models');
const axios = require('axios');

async function fetchAndSaveCrewInfo({slug}) {
  const CREW_INFO_NEXT_FETCH_AFTER = 1000 * 60 * 60 * 24 * 7;

  const crew = await Crew.findOne({slug});

  if (crew && new Date() - crew.lastInfoFetch < CREW_INFO_NEXT_FETCH_AFTER) {
    throw new Error('Crew info don\'t need to be fetched');
  }

  const {data} = await axios({
    baseURL: 'https://socialclub.rockstargames.com/',
    url: `/crew/${slug}`
  });

  const idMatch = data.match(/\\"CrewId\\":(\d+),/);
  const nameMatch = data.match(/\\"crewname\\":\\"([\w -]+)\\"/);
  const avatarMatch = data.match(/crews\/sc\/(\d+)\/(\d+)\/publish\//);
  const descMatch = data.match(/\\"status\\":\\"(.*?)\\"/);
  const leaderMatch = data.match(/\\"leader\\":\\"(.+?)\\"/);
  const mottoMatch = data.match(/\\"motto\\":\\"(.+?)\\"/);
  const colorMatch = data.match(/\\"crewColor\\":\\"#(\w+)\\"/);
  const tagMatch = data.match(/\\"CrewTag\\":\\"(\w{3,4})\\"/);
  const countMatch = data.match(/\\"mCount\\":(\d+),/);

  const rockstar = !avatarMatch;

  let additionalCrewInfo = {};

  const crewInfo = {
    slug,
    crewId: idMatch[1],
    rockstar,
    name: nameMatch[1],
    tag: tagMatch[1],
    count: countMatch[1]
  }

  if (!rockstar) {
    additionalCrewInfo = {
      leader: leaderMatch[1],
      motto: mottoMatch[1],
      avatarId: avatarMatch[1],
      color: colorMatch[1]
    }

    if (descMatch) {
      additionalCrewInfo.desc = descMatch[1];
    }
  }

  const crewInfo = {
    ...crewInfo,
    ...additionalCrewInfo,
    lastInfoFetch: new Date()
  };

  if (crew) {
    crew.set(crewInfo);
  }

  await (crew || new Crew(crewInfo)).save();
}

module.exports = {
  fetchAndSaveCrewInfo
};
