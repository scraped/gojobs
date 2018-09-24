const axios = require('axios');
const {Cookie} = require('tough-cookie');
const redis = require('./redis');
const {serializeCookies} = require('./helpers');
const {platforms} = require('../config/static');

class RgscFetcher {
  static setupBasicRgscFetcher() {
    return axios.create({
      baseURL: 'https://socialclub.rockstargames.com/',
    });
  }

  constructor(platform = 'pc') {
    if (!platforms.platform) {
      throw new Error(`${platform}: unknown platform`);
    }

    this.fetcher = RgscFetcher.setupBasicRgscFetcher();
    this.fetcher.defaults.headers = {
      'Accept-Language': 'en-US,en',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest',
    };

    this.platform = platform;
    this.credentials = null;
  }

  resetCredentials() {
    this.credentials = {
      cookies: {},
      requestVerificationToken: '',
    };
  }

  redisKey(rqvt = false) {
    const name = rqvt
      ? 'token'
      : 'cookies';
    return `rgsc-fetcher:${name}:${this.platform}`;
  }

  setCookies(cookies = {}) {
    this.credentials.cookies = cookies;
    this.fetcher.defaults.headers.Cookie = serializeCookies({
      UAGC: 1,
      ...cookies,
    });
  }

  setRequestVerificationToken(token = '') {
    this.credentials.requestVerificationToken = token;
    this.fetcher.defaults.headers.requestVerificationToken = token;
  }

  async fetch(fetcherParams) {
    if (!this.credentials) {
      await this.resetCredentials();
      await this.updateCredentials();
    }

    let result;

    // Must be an arrow function to access this
    const tryToFetch = async () => {
      result = await this.fetcher(fetcherParams);
      // result = await this.fetcher({
      //   url: '/games/gtav/ajax/mission',
      //   params: {missionid: jobId},
      // });
    };

    try {
      await tryToFetch();
    } catch (error) {
      const {status} = error;
      if (status !== 429) {
        await this.getNewCredentials();
        await tryToFetch();
      }
    }

    return result;
  }

  async updateCredentials() {
    return await this.retrieveCredentialsFromDb()
      || await this.getNewCredentials();
  }

  async retrieveCredentialsFromDb() {
    let credentials;

    try {
      credentials = JSON.parse(await redis.getAsync(this.redisKey()));
    } catch (error) {
      return null;
    }

    if (!credentials) {
      return null;
    }

    const {cookies, requestVerificationToken} = credentials;

    if (!cookies || !requestVerificationToken) {
      return null;
    }

    this.setCookies(cookies);
    this.setRequestVerificationToken(requestVerificationToken);

    return credentials;
  }

  async getNewCredentials() {
    const REQUEST_VERIF_TOKEN_REGEX = /value="([a-z0-9_-]*)" \/>/im;

    const parsedCookiesObject = {};

    this.resetCredentials();

    const setCookieHttpHeader = (await this.fetcher()).headers['set-cookie'];

    const parsedCookies = Array.isArray(setCookieHttpHeader)
      ? setCookieHttpHeader.map(Cookie.parse)
      : [Cookie.parse(setCookieHttpHeader)];

    parsedCookies.forEach(cookie => {
      const {key, value} = cookie;
      // Don't need all the cookies
      if (key === 'prod' || key === 'CSRFToken') {
        parsedCookiesObject[key] = value;
      }
    });

    this.setCookies(parsedCookiesObject);

    const requestVerificationTokenMatch = (await this.fetcher({
      url: `/games/gtav/${this.platform}/jobs/`,
    })).data.match(REQUEST_VERIF_TOKEN_REGEX);

    this.setRequestVerificationToken(requestVerificationTokenMatch[1]);

    await redis.setAsync(
      this.redisKey(),
      JSON.stringify(this.credentials),
    );

    return this.credentials;
  }
}

module.exports = RgscFetcher;
