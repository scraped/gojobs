const axios = require('axios');
const puppeteer = require('puppeteer');
const redis = require('../redis');
const {serializeCookies} = require('../helpers');

class JobFetcher {
  constructor() {
    this.fetcher = axios.create({
      baseURL: 'https://socialclub.rockstargames.com/',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept-Language': 'en-US,en',
      }
    });

    this.credentials = null;
  }

  resetCredentials() {
    this.credentials = null;
    this.fetcher.defaults.headers.Cookie = '';
    this.fetcher.defaults.headers.requestVerificationToken = '';
  }

  redisKey() {
    return 'rgsc-fetcher';
  }

  setCredentials(cookies = {}, token = '') {
    this.credentials = {
      cookies,
      requestVerificationToken: token,
    };

    this.fetcher.defaults.headers.Cookie = serializeCookies({
      UAGC: 1,
      ...cookies,
    });

    this.fetcher.defaults.headers.requestVerificationToken = token;
  }

  async fetch({jobId}) {
    if (!this.credentials) {
      await this.getCredentials();
    }

    let result;

    const tryToFetch = async () => {
      result = await this.fetcher({
        url: '/games/gtav/ajax/mission',
        params: {missionid: jobId},
      });
    };

    try {
      await tryToFetch();
    } catch (error) {
      const {status} = error;
      if (status === 429) {
        throw error;
      }
      await this.getNewCredentials();
      await tryToFetch();
    }

    return result;
  }

  async getCredentials() {
    this.resetCredentials();

    await this.retrieveCredentialsFromDb();

    if (!this.credentials) {
      await this.getNewCredentials();
    }
  }

  async retrieveCredentialsFromDb() {
    let credentials;

    try {
      credentials = JSON.parse(await redis.getAsync(this.redisKey()));
    } catch (error) {
      return;
    }

    if (!credentials) {
      return;
    }

    console.log('here', credentials);

    const {cookies, requestVerificationToken} = credentials;

    if (!cookies || !requestVerificationToken) {
      return;
    }

    this.setCredentials(cookies, requestVerificationToken);
  }

  async getNewCredentials() {
    const url = 'https://socialclub.rockstargames.com/games/gtav/pc/playlists';
    const rqvtElementSelector = 'body > input[type="hidden"]';

    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(url);
    await page.setCookie({
      name: 'UAGC',
      value: '1',
      httpOnly: true,
    });
    await page.goto(url);

    const cookies = await page.cookies();
    const tokenElement = await page.$(rqvtElementSelector);

    const requestVerificationToken = await page.evaluate(
      el => el.value,
      tokenElement,
    );

    await page.close();
    await browser.close();

    const retrievedCookies = cookies.reduce(
      (prev, {name, value}) => {
        // eslint-disable-next-line
        prev[name] = value;
        return prev;
      },
      {}
    );

    this.setCredentials(retrievedCookies, requestVerificationToken);

    await redis.setAsync(this.redisKey(), JSON.stringify(this.credentials));
  }
}

module.exports = JobFetcher;
