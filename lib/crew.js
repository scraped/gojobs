const axios = require('axios');

module.exports = {
  fetchCrewInfo
};

async function fetchCrewInfo({slug}) {
  const axiosOptions = {
    baseURL: 'https://socialclub.rockstargames.com/',
    url: `/crew/${slug}`
  };

  const {data} = await axios(axiosOptions);

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

  return {
    ...crewInfo,
    ...additionalCrewInfo
  };
}
