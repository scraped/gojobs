const config = require('../config');
const axios = require('axios');

const Crew = require('../models/crew');

module.exports = {
  getCrewDocument
};

/**
 * Returns crew document. Adds crew to the DB if it doesn't exist.
 * @param {string} slug RGSC crew slug.
 * @returns {object} crew object (new or old one; can be null).
 */
async function getCrewDocument({ slug }) {
  try {
    const crew = await Crew.findOne({ slug });

    if (crew) {
      const { lastInfoFetch } = crew;
      const SEVEN_DAYS = 60 * 60 * 24 * 7;
      if (lastInfoFetch - new Date() < SEVEN_DAYS) {
        return crew;
      }
    }

    const crewInfo = await fetchCrewInfo({ slug });

    if (!crewInfo) {
      return null;
    }

    const { crewId } = crewInfo;

    return await Crew.findOneAndUpdate(
      { slug },
      { slug, ...crewInfo, lastInfoFetch: new Date() },
      config.mongo.standardUpdateOptions
    );
  } catch (error) {
    console.log(`crewDocument error: ${error.message}`);
    return null;
  }
}

async function fetchCrewInfo({ slug }) {
  const axiosOptions = {
    baseURL: 'https://socialclub.rockstargames.com/',
    url: `/crew/${slug}`,
    method: 'get'
  };

  console.log(`Fetching crew info: ${slug}`);

  try {
    const { data } = await axios(axiosOptions);

    const idMatch = data.match(/\\"CrewId\\":(\d+),/);
    const nameMatch = data.match(/\\"crewname\\":\\"([\w -]+)\\"/);
    const avatarMatch = data.match(/crews\/sc\/(\d+)\/(\d+)\/publish\//);
    const descMatch = data.match(/\\"status\\":\\"(.+?)\\"/);
    const leaderMatch = data.match(/\\"leader\\":\\"(.+?)\\"/);
    const mottoMatch = data.match(/\\"motto\\":\\"(.+?)\\"/);
    const colorMatch = data.match(/\\"crewColor\\":\\"#(\w+)\\"/);
    const tagMatch = data.match(/\\"CrewTag\\":\\"(\w{3,4})\\"/);

    const rockstar = !Boolean(avatarMatch);

    let additionalCrewInfo = {};

    const crewInfo = {
      crewId: idMatch[1],
      rockstar,
      name: nameMatch[1],
      tag: tagMatch[1]
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
  } catch (error) {
    console.log(`fetchCrewInfo error: ${error.message}`);
    return null;
  }
}
