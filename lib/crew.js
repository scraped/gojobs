const config = require('../config');
const axios = require('axios');
const _ = require('lodash');

const Crew = require('../models/crew');

/**
 * Returns crew document ID. Adds crew to the DB if it doesn't exist.
 * @param {string} slug RGSC crew slug.
 * @returns {object} crew object (new or old one).
 */
exports.getCrewDoc = async function ({ slug }) {
  let crew = await Crew.findOne({ slug });

  if (!crew) {
    let crewInfo;

    try {
      crewInfo = await fetchCrewInfo({ slug });
    } catch (e) {
      throw e;
    }

    const { crewId } = crewInfo,
      newCrewDoc = _.assign({ slug }, crewInfo);

    crew = await Crew.findOneAndUpdate(
      { crewId, slug },
      newCrewDoc,
      config.mongo.standardUpdateOptions
    );
  }

  return crew;
}

async function fetchCrewInfo({ slug }) {
  const url = `https://socialclub.rockstargames.com/crew/${slug}`;

  console.log(`Crew ${slug}: fetching info.`);

  const response = (await axios.get(url)).data;

  const idMatch = response.match(/\\"CrewId\\":(\d+),/),
    nameMatch = response.match(/\\"crewname\\":\\"([\w -]+)\\"/),
    avatarMatch = response.match(/crews\/sc\/(\d+)\/(\d+)\/publish\//),
    descMatch = response.match(/\\"status\\":\\"(.+)\\"/),
    leaderMatch = response.match(/\\"leader\\":\\"(.+)\\"/),
    mottoMatch = response.match(/\\"motto\\":\\"(.+)\\"/),
    colorMatch = response.match(/\\"crewColor\\":\\"#(\w+)\\"/),
    tagMatch = response.match(/\\"CrewTag\\":\\"(\w{3,4})\\"/);

  console.log(`Crew ${slug}: fetching compete.`);

  const notRockstar = Boolean(avatarMatch),
    rockstar = !notRockstar;

  let crewInfo = {},
    additionalCrewInfo = {};

  crewInfo = {
    crewId: idMatch[1],
    rockstar,
    name: nameMatch[1],
    tag: tagMatch[1]
  }

  if (notRockstar) {
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

  return _.assign(crewInfo, additionalCrewInfo);
}
