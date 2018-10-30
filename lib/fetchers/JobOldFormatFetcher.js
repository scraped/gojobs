const axios = require('axios');
const puppeteer = require('puppeteer');
const redis = require('../../config/redis');
const {serializeCookies} = require('../helpers');
const redisKeys = require('../../config/redis-keys');
const {platforms} = require('../../config/static');

class JobOldFormatFetcher {
  constructor(platform) {
    if (!platforms[platform]) {
      throw new Error(`Invalid platform "${platform}"`);
    }

    this.platform = platform;

    this.fetcher = axios.create({
      baseURL: 'https://socialclub.rockstargames.com/',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept-Language': 'en-US,en',
      },
    });

    this.credentials = null;
  }

  resetCredentials() {
    this.credentials = null;
    this.fetcher.defaults.headers.Cookie = '';
    this.fetcher.defaults.headers.requestVerificationToken = '';
  }

  redisKey() {
    return redisKeys.fetchJobs(this.platform);
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
      const {status} = error.response;
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

    const {cookies, requestVerificationToken} = credentials;

    if (!cookies || !requestVerificationToken) {
      return;
    }

    this.setCredentials(cookies, requestVerificationToken);
  }

  async getNewCredentials() {
    let cookies = [];
    let requestVerificationToken = '';

    console.log('Launching Chrome');
    const browser = await puppeteer.launch();

    try {
      const url = `https://socialclub.rockstargames.com/games/gtav/${this.platform}/playlists`;
      const rqvtElementSelector = 'body > input[type="hidden"]';

      const page = await browser.newPage();

      await page.goto(url);

      await page.setCookie({
        name: 'UAGC',
        value: '1',
        httpOnly: true,
      });

      await page.goto(url);

      cookies = await page.cookies();

      const tokenElement = await page.$(rqvtElementSelector);

      requestVerificationToken = await page.evaluate(
        el => el.value,
        tokenElement,
      );

      await page.close();
    } catch (error) {
      throw error;
    } finally {
      await browser.close();
      console.log('Chrome killed');
    }

    const retrievedCookies = cookies.reduce(
      (prev, {name, value}) => {
        prev[name] = value;
        return prev;
      },
      {},
    );

    this.setCredentials(retrievedCookies, requestVerificationToken);

    await redis.setAsync(this.redisKey(), JSON.stringify(this.credentials));
  }
}

module.exports = JobOldFormatFetcher;
