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
    this._cookies = {};
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

  _setCookieHeader(cookies = {}) {
    this._cookies = cookies;

    this._axiosOptions.headers.Cookie = serializeCookies({
      UAGD: '1/1/1990',
      UAGC: 1,
      gtav_jobsview: 'cols',
      ...this._cookies
    });
  }

  _redisSpecialKey(rqvt = false) {
    const name = rqvt
      ? 'rqvt'
      : 'cookies';
    return `rgsc:${name}:${this._platform}`;
  }

  get cookies() {
    return this._cookies;
  }

  set cookies(cookies) {
    this._setCookieHeader(cookies);
  }

  async retrieveCookieHeader() {
    try {
      const savedHeaders = await redis.getAsync(this._redisHeadersKey());

      return savedHeaders
        ? JSON.parse(savedHeaders)
        : null;
    } catch (error) {
      return null;
    }
  }

  async updateCookieHeader() {
    const REQUEST_VERIF_TOKEN_REGEX = /value="([a-z0-9_-]*)" \/>/mi;

    let parsedCookiesObject = {};

    this.cookies = {};

    try {
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

      const requestVerifTokenMatch = (await axios({
        ...this._axiosOptions,
        url: `/games/gtav/${this._platform}/jobs/`
      })).data.match(REQUEST_VERIF_TOKEN_REGEX);

      const requestVerifToken = requestVerifTokenMatch[1];

      this._axiosOptions.headers.RequestVerificationToken = requestVerifToken;

      await redis.setAsync(
        this._redisHeadersKey(),
        JSON.stringify(parsedCookiesObject)
      );

      await redis.setAsync(
        this._redisHeadersKey(true),
        requestVerifToken
      );
    } catch (error) {
      return null;
    }

    return parsedCookiesObject;
  }

  async generateHeaders() {
    let headers = (await this.retrieveCookieHeader());

    if (!headers || !headers.keys().length) {
      headers = await this.refreshHeaders();
    }

    if (headers && headers.keys().length) {
      this.http.headers = headers;
      return headers;
    }

    return null;
  }
}
