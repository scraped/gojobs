const axios = require('axios');

async function fetchCrewInfo({ slug }) {
  const url = `https://socialclub.rockstargames.com/crew/${slug}`;

  const response = (await axios.get(url)).data;

  const idMatch = response.match(/\\"CrewId\\":(\d+),/),
    nameMatch = response.match(/\\"crewname\\":\\"([\w -]+)\\"/),
    avatarMatch = response.match(/crews\/sc\/(\d+)\/(\d+)\/publish\//),
    descMatch = response.match(/\\"status\\":\\"[x]+\\"/),
    leaderMatch = response.match(/\\"leader\\":/);

  let crewInfo = {
    crewId: idMatch[1],
    name: nameMatch[1],
    rockstar: !avatarMatch
  }

  if (avatarMatch) crewInfo.avatar = avatarMatch[1];
  if (descMatch) crewInfo.desc = descMatch[1];

  return crewInfo;
}
