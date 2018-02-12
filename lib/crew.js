const config = require('../config');
const axios = require('axios');
const _ = require('lodash');

const Crew = require('../models/crew');

/**
 * Adds crew to the DB if it doesn't exist.
 * @param {string} slug RGSC crew slug.
 * @returns {object} crew object (new or old one).
 */
exports.addCrew = async function ({ slug }) {
  let crew = await Crew.findOne({ slug });

  if (!crew) {
    const crewInfo = await fetchCrewInfo(slug);

    const { crewId } = crewInfo,
      newCrewDoc = _.assign({ slug }, crewInfo);

    crew = await Crew.findOneAndUpdate(
      { crewId, slug },
      newCrewDoc,
      config.mongo.standardUpdateOptions
    );
  }

  return crew;

  // userInfo.crew = crewDocId;
  // newJob.crew = crewDocId;
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
    tagMatch = response.match(/\\"crewTag\\":\\"#(\w{3,4})\\"/);

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
      desc: descMatch[1],
      motto: mottoMatch[1],
      avatarId: avatarMatch[1],
      color: colorMatch[1]
    }
  }

  return _.assign(crewInfo, additionalCrewInfo);
}
