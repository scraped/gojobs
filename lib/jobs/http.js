const axios = require('axios');
const redis = require('../redis');
const {Cookie} = require('tough-cookie');

module.exports = {
  RgscHttpClient
};

exports.generateHeaders = function generateHeaders() {
  let headers = {
    baseURL: 'https://socialclub.rockstargames.com/',
    headers: {
      'Accept-Language': 'en-US,en',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    }
  };
};

class RgscHttpClient {
  constructor(platform = 'pc') {
    this._platform = platform;
    this._http = axios.create();
  }

  _redisHeadersKey() {
    return `rgsc:headers:${this._platform}`;
  }

  get http() {
    return this._http;
  }

  async retrieveSavedHeaders() {
    try {
      const savedHeaders = await redis.getAsync(this._redisHeadersKey());

      return savedHeaders
        ? JSON.parse(savedHeaders)
        : null;
    } catch (error) {
      return null;
    }
  }

  async refreshHeaders() {
    let headers = {};

    try {
      const setCookieHttpHeader = (await this.http()).headers['set-cookie'];

      let cookies = {
        UAGD: '1/1/1990',
        UAGC: 1,
        gtav_jobsview: 'cols'
      };

      const parsedCookies = Array.isArray(setCookieHttpHeader)
        ? setCookieHttpHeader.map(Cookie.parse)
        : [Cookie.parse(setCookieHttpHeader)];

      cookies.push(...parsedCookies);

      headers.Cookie = Cookie.cookieString(cookies);

      const tokenRegex = /value="([a-z0-9_-]*)" \/>/mi;

      const requestVerifTokenMatch = (await this.http({
        url: `/games/gtav/${this._platform}/jobs/`,
        headers
      })).data.match(tokenRegex);

      headers.RequestVerificationToken = requestVerifTokenMatch[1];
    } catch (error) {
      return null;
    }

    try {
      await redis.setAsync(
        this._redisHeadersKey(),
        JSON.stringify(headers)
      );
    } catch (error) {}

    this.http.headers = headers;

    return headers;
  }

  async generateHeaders() {
    let headers = (await this.retrieveSavedHeaders());

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
