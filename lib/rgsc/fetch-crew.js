const puppeteer = require('puppeteer');
const {CrewBasicInfoFetcher} = require('../fetchers');

module.exports = async function fetchCrew(slug) {
  const fetcher = new CrewBasicInfoFetcher();

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

  let crewInfo = {
    slug,
    crewId,
    rockstar: isRockstar,
    name: crewName,
    motto: crewMotto,
    tag: crewTag,
    color: crewColor,
    memberCount,
  };

  const browser = await puppeteer.launch();
  console.log(`${slug} crew: chrome launched`);
  const page = await browser.newPage();

  try {
    const crewUrl = `https://socialclub.rockstargames.com/crew/${slug}/hierarchy`;
    const avatarElementSelector = '.CrewHeader__emblemWrap__2QHFY img';
    const crewLeaderSelector = '#app-page > div.CrewHierarchy__wrap__2bgQA > div.CrewHierarchy__mainCol__34qbH > ul > div:nth-child(1) > li > div > div > div > p';

    const waitForSelector = isRockstar
      ? avatarElementSelector
      : crewLeaderSelector;

    await page.goto(crewUrl);
    await page.waitFor(waitForSelector);

    const avatarElement = await page.$(avatarElementSelector);

    const avatarUrl = await page.evaluate(
      el => el.src,
      avatarElement,
    );

    // https://prod.cloud.rockstargames.com/crews/sc/{avatarId}/{crewId}/publish/emblem/emblem_{image size}.png
    crewInfo.avatarId = avatarUrl.split('/')[5];

    if (!isRockstar) {
      const leaderElement = await page.$(crewLeaderSelector);

      const leader = await page.evaluate(
        el => el.textContent,
        leaderElement,
      );

      crewInfo.leader = leader.trim();
    }
  } catch (error) {
    throw error;
  } finally {
    await page.close();
    await browser.close();
    console.log(`${slug} crew: chrome killed`);
  }

  return crewInfo;
};
