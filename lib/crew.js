const axios = require('axios');
const {platforms} = require('../config/static');
const {Crew, FetchStats} = require('../models');

async function fetchAndSaveCrewInfo({slug}) {
  const CREW_INFO_NEXT_FETCH_AFTER = 1000 * 60 * 60 * 24 * 7;

  const crew = await Crew.findOne({slug});

  // if (crew && new Date() - crew.lastInfoFetch < CREW_INFO_NEXT_FETCH_AFTER) {
  //   throw new Error('Crew info don\'t need to be fetched');
  // }

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

  const nonRockstar = leaderMatch;

  let crewInfo = {
    slug,
    crewId: idMatch[1],
    rockstar: !nonRockstar,
    name: nameMatch[1],
    tag: tagMatch[1],
    count: countMatch[1]
  }

  if (nonRockstar) {
    Object.assign(crewInfo, {
      leader: leaderMatch[1],
      motto: mottoMatch[1],
      color: colorMatch[1]
    });

    if (avatarMatch) {
      crewInfo.avatarId = avatarMatch[1];
    }

    if (descMatch) {
      crewInfo.desc = descMatch[1];
    }
  }

  crewInfo.lastInfoFetch = new Date();

  if (crew) {
    crew.set(crewInfo);
  }

  if (nonRockstar) {
    const {crewId} = crewInfo;

    Object.keys(platforms).forEach(async platform => {
      const crewFetchInfo = await FetchStats.findOne({
        crewId,
        platform
      });

      if (!crewFetchInfo) {
        await new FetchStats({
          category: 'crew',
          crewId,
          platform
        }).save();
      }
    });
  }

  const result = await (crew || new Crew(crewInfo)).save();

  return result;
}

module.exports = {
  fetchAndSaveCrewInfo
};
