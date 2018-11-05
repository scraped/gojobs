const axios = require('axios');
const puppeteer = require('puppeteer');
const addMinutes = require('date-fns/add_minutes');
const isAfter = require('date-fns/is_after');
const {redisClient} = require('../../config/redis');
const {serializeCookies} = require('../helpers');
const redisKeys = require('../../config/redis-keys');
const {platforms} = require('../../config/static');

module.exports = class JobOldFormatFetcher {
  constructor(platform) {
    if (!platforms[platform]) {
      throw new Error(`"${platform}": invalid platform`);
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
    this.setCredentials();
    this.credentials = null;
  }

  redisCredentialsKey() {
    return redisKeys.rgscFetchCredentials(this.platform);
  }

  redisDelayKey() {
    return redisKeys.rgscFetchDelay;
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

    this.fetcher.defaults.headers.RequestVerificationToken = token;
  }

  async delayRequests() {
    await redisClient.setAsync(
      this.redisDelayKey(),
      addMinutes(new Date(), 5),
    );
  }

  async fetch({jobId}) {
    const nextFetchAfter = await redisClient.getAsync(this.redisDelayKey());

    if (nextFetchAfter
      && isAfter(new Date(nextFetchAfter), new Date())) {
      throw new Error('Rockstar servers will probably respond with 429 error right now. Next fetch should be performed a little bit later');
    }

    if (!this.credentials) {
      await this.getCredentials();
    }

    const tryToFetch = () => this.fetcher({
      url: '/games/gtav/ajax/mission',
      params: {missionid: jobId},
    });

    let result;

    try {
      // await this.getNewCredentials();
      result = await tryToFetch();
      if (!result.data) {
        await this.getNewCredentials();
        result = await tryToFetch();
      }
    } catch (error) {
      const {status} = error.response;

      if (status === 429) {
        await this.delayRequests();
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
      credentials = JSON.parse(
        await redisClient.getAsync(this.redisCredentialsKey()),
      );
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

    const browser = await puppeteer.launch();
    console.log('Chromium launched');

    try {
      const url = `https://socialclub.rockstargames.com/games/gtav/${this.platform}/playlists`;
      const rqvtElementSelector = 'input[name="__RequestVerificationToken"]';

      const page = await browser.newPage();

      let response = await page.goto(url);

      if (response.status() >= 429) {
        await this.delayRequests();
      }

      await page.setCookie({
        name: 'UAGC',
        value: '1',
        httpOnly: true,
      });

      response = await page.reload();

      if (response.status() >= 429) {
        await this.delayRequests();
      }

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
      console.log('Chromium killed');
    }

    const retrievedCookies = cookies.reduce(
      (prev, {name, value}) => {
        prev[name] = value;
        return prev;
      },
      {},
    );

    this.setCredentials(retrievedCookies, requestVerificationToken);

    await redisClient.setAsync(
      this.redisCredentialsKey(),
      JSON.stringify(this.credentials),
    );
  }
};
