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
    this._credentials = {
      cookies: {},
      requestVerificationToken: ''
    };
    this._axiosOptions = {
      baseURL: 'https://socialclub.rockstargames.com/',
      headers: {
        'Accept-Language': 'en-US,en',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      }
    };
    this._setCookieHeader();
  }

  _setCookies(cookies = {}) {
    this._credentials.cookies = cookies;

    this._axiosOptions.headers.Cookie = serializeCookies({
      UAGC: 1,
      ...cookies
    });
  }

  _setRequestVerificationToken(token = '') {
    this._credentials.requestVerificationToken = token;
  }

  _redisSpecialKey(rqvt = false) {
    const name = rqvt
      ? 'rqvt'
      : 'cookies';
    return `rgsc:${name}:${this._platform}`;
  }

  set cookies(cookies) {
    this._setCookies(cookies);
  }

  set requestVerificationToken(token) {
    this._setRequestVerificationToken(token);
  }

  set credentials(credentials) {
    const {cookies, requestVerificationToken} = credentials;
    this._setCookies(cookies);
    this._setRequestVerificationToken(requestVerificationToken);
  }

  async retrieveCredentialsFromDb() {
    const credentials = JSON.parse(
      await redis.getAsync(this._redisHeadersKey())
    );

    const {cookies, requestVerificationToken} = credentials;

    this.cookies = cookies;
    this.requestVerificationToken = requestVerificationToken;

    return credentials;
  }

  async getNewCredentials() {
    const REQUEST_VERIF_TOKEN_REGEX = /value="([a-z0-9_-]*)" \/>/mi;

    let parsedCookiesObject = {};

    this.cookies = {};
    this.requestVerificationToken = '';

    const setCookieHttpHeader = (await axios(this._axiosOptions))
      .headers['set-cookie'];

    const parsedCookies = Array.isArray(setCookieHttpHeader)
      ? setCookieHttpHeader.map(Cookie.parse)
      : [Cookie.parse(setCookieHttpHeader)];

    parsedCookies.forEach(cookie => {
      const {key, value} = cookie;
      parsedCookiesObject[key] = value;
    });

    this.cookies = parsedCookiesObject;

    const requestVerificationTokenMatch = (await axios({
      ...this._axiosOptions,
      url: `/games/gtav/${this._platform}/jobs/`
    })).data.match(REQUEST_VERIF_TOKEN_REGEX);

    const requestVerificationToken = requestVerificationTokenMatch[1];

    this.requestVerificationToken = requestVerificationToken;

    await redis.setAsync(
      this._redisHeadersKey(),
      JSON.stringify(this._credentials)
    );

    return this._credentials;
  }
}
