const find = require('lodash/find');
const puppeteer = require('puppeteer');
const {Crew, FetchInfo} = require('../models');
const {CrewFetcher} = require('./fetchers');
const {platforms} = require('../config/static');

async function fetchCrew({slug, save = true}) {
  if (!slug) {
    throw new Error('Crew ID must be specified');
  }

  const CREW_INFO_NEXT_FETCH_AFTER = 1000 * 60 * 60 * 24 * 7;

  const crew = await Crew.findOne({slug});

  if (save
    && crew
    && new Date() - crew.lastInfoFetch < CREW_INFO_NEXT_FETCH_AFTER) {
    throw new Error('Crew info do not need to be fetched');
  }

  const fetcher = new CrewFetcher();

  const {data} = await fetcher.fetch({crewSlug: slug});

  const {
    crewId,
    crewName,
    crewTag,
    crewMotto,
    memberCount,
    isSystem: isRockstar,
    status,
  } = data;

  if (!status) {
    throw new Error('Cannot fetch this crew. Probably it does not exist');
  }

  // #rrggbbaa -> rrggbb
  const crewColor = data.crewColour.substring(1, 7);

  const crewInfo = {
    slug,
    crewId,
    rockstar: isRockstar,
    name: crewName,
    motto: crewMotto,
    tag: crewTag.toUpperCase(),
    color: crewColor,
    memberCount,
  };

  let avatarUrl = '';

  const browser = await puppeteer.launch();

  try {
    const crewUrl = `https://socialclub.rockstargames.com/crew/${slug}`;
    const avatarElementSelector = '.CrewHeader__emblemWrap__2QHFY img';

    const page = await browser.newPage();
    await page.goto(crewUrl);
    await page.waitFor(avatarElementSelector);

    const avatarElement = await page.$(avatarElementSelector);

    avatarUrl = await page.evaluate(
      el => el.src,
      avatarElement,
    );

    await page.close();
  } catch (error) {
    throw error;
  } finally {
    await browser.close();
  }

  Object.assign(crewInfo, {
    lastInfoFetch: new Date(),
    // https://prod.cloud.rockstargames.com/crews/sc/{avatarId}/{crewId}/publish/emblem/emblem_{image size}.png
    avatarId: avatarUrl.split('/')[5],
  });

  if (!isRockstar) {
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
      nextFetch: new Date(),
    }).save()));
  }

  if (save) {
    if (crew) {
      crew.set(crewInfo);
    }

    await (crew || new Crew(crewInfo)).save();
  }

  return crewInfo;
}

module.exports = fetchCrew;
