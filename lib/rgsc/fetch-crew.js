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
  console.log(`${slug}: launched`);
  const page = await browser.newPage();

  try {
    const crewUrl = `https://socialclub.rockstargames.com/crew/${slug}/hierarchy`;
    const avatarElementSelector = '.CrewHeader__emblemWrap__2QHFY img';

    await page.goto(crewUrl);
    await page.waitFor(avatarElementSelector);

    const avatarElement = await page.$(avatarElementSelector);

    const avatarUrl = await page.evaluate(
      el => el.src,
      avatarElement,
    );

    // https://prod.cloud.rockstargames.com/crews/sc/{avatarId}/{crewId}/publish/emblem/emblem_{image size}.png
    crewInfo.avatarId = avatarUrl.split('/')[5];

    if (!isRockstar) {
      const crewLeaderSelector = '.CrewHierarchy__list__2vKYR > div:nth-child(1) > li:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > p:nth-child(3)';

      const leaderElement = await page.$(crewLeaderSelector);

      crewInfo.leader = await page.evaluate(
        el => el.lastChild.innerHTML,
        leaderElement,
      );
    }
  } catch (error) {
    console.log(`${slug}: error`);
    throw error;
  } finally {
    console.log(`${slug}: closing`);
    await page.close();
    console.log(`${slug}: closed page`);
    await browser.close();
    console.log(`${slug}: closed browser`);
  }

  return crewInfo;
};
