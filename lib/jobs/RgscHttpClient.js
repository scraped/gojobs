const axios = require('axios');
const redis = require('../redis');
const {Cookie} = require('tough-cookie');
const {serializeCookies} = require('../helpers');

class RgscHttpClient {
  constructor(platform = 'pc') {
    this.fetcher = axios.create({
      baseURL: 'https://socialclub.rockstargames.com/',
      headers: {
        'Accept-Language': 'en-US,en',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    this.platform = platform;
    this.credentials = {
      cookies: {},
      requestVerificationToken: ''
    };
  }

  static async setupRgscHttpClient(platform = 'pc') {
    const client = new RgscHttpClient(platform);
    await client.getCredentials();
    return client;
  }

  resetCredentials() {
    this.setCookies();
    this.setRequestVerificationToken();
  }

  redisKey(rqvt = false) {
    const name = rqvt
      ? 'rqvt'
      : 'cookies';
    return `rgsc:${name}:${this.platform}`;
  }

  setCookies(cookies = {}) {
    this.credentials.cookies = cookies;

    this.fetcher.defaults.headers.Cookie = serializeCookies({
      UAGC: 1,
      ...cookies
    });
  }

  setRequestVerificationToken(token = '') {
    this.credentials.requestVerificationToken = token;

    this.fetcher.defaults.headers.requestVerificationToken = token;
  }

  async fetchJob(jobId) {
    return await this.fetcher({
      url: '/games/gtav/ajax/mission',
      params: {missionid: jobId}
    });
  }

  async getCredentials() {
    const TEST_MISSION_ID = 'E1V_s4f2GEWvyI91KXXl3A';

    let credentials = await this.retrieveCredentialsFromDb();

    // Check whether credentials are valid
    if (credentials) {
      try {
        await this.fetchJob(TEST_MISSION_ID);
        return credentials;
      // eslint-disable-next-line
      } catch (error) {}
    }

    credentials = await this.getNewCredentials();

    return credentials || null;
  }

  async retrieveCredentialsFromDb() {
    let credentials;

    try {
      credentials = JSON.parse(
        await redis.getAsync(this.redisKey())
      );
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
    const REQUEST_VERIF_TOKEN_REGEX = /value="([a-z0-9_-]*)" \/>/mi;

    let parsedCookiesObject = {};

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

    this.cookies = parsedCookiesObject;

    const requestVerificationTokenMatch = (await this.fetcher({
      url: `/games/gtav/${this.platform}/jobs/`
    })).data.match(REQUEST_VERIF_TOKEN_REGEX);

    const requestVerificationToken = requestVerificationTokenMatch[1];

    this.requestVerificationToken = requestVerificationToken;

    await redis.setAsync(
      this.redisKey(),
      JSON.stringify(this.credentials)
    );

    return this.credentials;
  }
}

module.exports = RgscHttpClient;