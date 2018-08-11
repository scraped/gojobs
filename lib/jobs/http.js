const axios = require('axios');
const redis = require('../redis');
const {Cookie} = require('tough-cookie');

module.exports = {
  genAxiosOptionsToFetchJobs
};

/**
 * Generates axios 'options' object for fetching jobs from RGSC site:
 * 1) adds baseURL property
 * 2) adds a proper "Cookie" header
 * 3) adds "RequestVerificationToken" header
 * 4) adds "X-Requested-With: XMLHttpRequest" header
 * 5) adds other necessary headers
 * @param {string} platform the same platform used in fetchBunches
 * (default: pc)
 * @returns {Promise<object>} axios 'options' object.
 */
async function genAxiosOptionsToFetchJobs(platform = 'pc') {
  let axiosInstance = axios.create({
    baseURL: 'https://socialclub.rockstargames.com/',
    headers: {
      'Accept-Language': 'en-US,en',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  let additionalHeaders = {};

  try {
    const savedHeaders = await redis.get('rgsc-headers');

    if (savedHeaders) {
      additionalHeaders =
    }
  } catch (error) {}

  try {
    const setCookieHttpHeader = (await axiosInstance()).headers['set-cookie'];

    let cookies = {
      UAGD: '1/1/1990',
      UAGC: 1,
      gtav_jobsview: 'cols'
    };

    const parsedCookies = Array.isArray(setCookieHttpHeader)
      ? setCookieHttpHeader.map(Cookie.parse)
      : [Cookie.parse(setCookieHttpHeader)];

    cookies.push(...parsedCookies);

    axiosInstance.headers.Cookie = Cookie.cookieString(cookies);
  } catch (error) {
    throw new Error('Error during cookie parsing occured');
  }

  // 2. Fetch job list page

  try {
    const tokenRegex = /value="([a-z0-9_-]*)" \/>/mi;

    const requestVerifTokenMatch = (await axiosInstance({
      url: `/games/gtav/${platform}/jobs/`
    })).data.match(tokenRegex);

    axiosInstance.headers.RequestVerificationToken = requestVerifTokenMatch[1];
  } catch (error) {
    throw new Error('Cannot parse RequestVerificationToken');
  }

  return axiosInstance;
}
