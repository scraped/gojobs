const axios = require('axios');
const redis = require('../redis');
const {Cookie} = require('tough-cookie');
const {serializeCookies} = require('../helpers');

module.exports = {
  RgscHttpClient
};

class RgscHttpClient {
  constructor(platform = 'pc') {
    this._platform = platform;
    this._resetCredentials();
    this._fetcher = axios.create({
      baseURL: 'https://socialclub.rockstargames.com/',
      headers: {
        'Accept-Language': 'en-US,en',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        Connection: 'keep-alive'
      }
    });
  }

  _resetCredentials() {
    this._credentials = {
      cookies: {},
      requestVerificationToken: ''
    };
  }

  _redisSpecialKey(rqvt = false) {
    const name = rqvt
      ? 'rqvt'
      : 'cookies';
    return `rgsc:${name}:${this._platform}`;
  }

  get fetcher() {
    return this._fetcher;
  }

  set credentials(credentials) {
    const {cookies, requestVerificationToken} = credentials;

    this._credentials.cookies = cookies;
    this._credentials.requestVerificationToken = requestVerificationToken;

    this._fetcher.headers.Cookie = serializeCookies({
      UAGC: 1,
      ...cookies
    });
  }

  async getCredentials() {
    let credentials = await this.retrieveCredentialsFromDb();

    if (credentials) {
      try {
        await this.fetcher({
          url: '/games/gtav/ajax/mission',
          params: { missionid: 'E1V_s4f2GEWvyI91KXXl3A' }
        });

        return credentials;
      } catch (error) {
        const {response} = error;
        if (!response || response.status !== '403') {
          return null;
        }
      }
    }

    credentials = await this.getNewCredentials();

    return credentials || null;
  }

  async retrieveCredentialsFromDb() {
    let credentials;

    try {
      credentials = JSON.parse(
        await redis.getAsync(this._redisSpecialKey())
      );
    } catch (error) {
      return null;
    }

    const {cookies, requestVerificationToken} = credentials;

    if (!cookies || !requestVerificationToken) {
      return null;
    }

    this.cookies = cookies;
    this.requestVerificationToken = requestVerificationToken;

    return credentials;
  }

  async getNewCredentials() {
    const REQUEST_VERIF_TOKEN_REGEX = /value="([a-z0-9_-]*)" \/>/mi;

    let parsedCookiesObject = {};

    this._resetCredentials();

    try {
      const setCookieHttpHeader = (await this.fetcher()).headers['set-cookie'];

      const parsedCookies = Array.isArray(setCookieHttpHeader)
        ? setCookieHttpHeader.map(Cookie.parse)
        : [Cookie.parse(setCookieHttpHeader)];

      parsedCookies.forEach(cookie => {
        const {key, value} = cookie;
        parsedCookiesObject[key] = value;
      });

      this.cookies = parsedCookiesObject;

      const requestVerificationTokenMatch = (await this.fetcher({
        url: `/games/gtav/${this._platform}/jobs/`
      })).data.match(REQUEST_VERIF_TOKEN_REGEX);

      const requestVerificationToken = requestVerificationTokenMatch[1];

      this.requestVerificationToken = requestVerificationToken;
    } catch (error) {
      this._resetCredentials();
      return null;
    }

    try {
      await redis.setAsync(
        this._redisSpecialKey(),
        JSON.stringify(this._credentials)
      );
    // eslint-disable-next-line
    } catch (error) {}

    return this._credentials;
  }
}
