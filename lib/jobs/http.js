const axios = require('axios');

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
  const baseURL = 'https://socialclub.rockstargames.com/';
  const cookieRegex = /(\w+)=([^;]*)/;
  const tokenRegex = /value="([a-z0-9_-]*)" \/>/mi;

  // Note that "baseURL" is the only valid axios option,
  // not "baseUrl" and whatnot!
  let axiosInstance = axios.create({
    baseURL,
    headers: {
      'Accept-Language': 'en-US,en',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  // 1. Fetch main page & parse cookies
  const cookies = (await axiosInstance()).headers['set-cookie'];

  if (!Array.isArray(cookies)) {
    throw new Error('No cookies detected');
  }

  let necessaryCookies = {};

  cookies.forEach(cookie => {
    const match = cookie.match(cookieRegex);

    if (!match) return;

    const name = match[1];
    const value = match[2];

    if (!value) return;

    switch (name) {
      case 'RockStarWebSessionId':
        necessaryCookies.RockStarWebSessionId = value;
        break;

      case 'CSRFToken':
        necessaryCookies.CSRFToken = value;
        break;

      case 'prod':
        necessaryCookies.prod = value;
        break;

      default:
    }
  });

  if (!necessaryCookies.keys().length) {
    throw new Error('Cannot detect all necessary cookies');
  }

  // 2. Fetch job list page
  axiosInstance.headers.Cookie = serializeCookies({
    UAGD: '1/1/1990',
    UAGC: 1,
    gtav_jobsview: 'cols',
    ...necessaryCookies
  });

  const listOfJobsPage = await axiosInstance({
    url: `/games/gtav/${platform}/jobs/`
  });

  const requestVerifTokenMatch = listOfJobsPage.data.match(tokenRegex);

  if (!requestVerifTokenMatch) {
    throw new Error('Cannot parse RequestVerificationToken');
  }

  // 3. Add RequestVerificationToken to the header
  axiosInstance.headers.RequestVerificationToken = requestVerifTokenMatch[1];

  return axiosInstance;
}

async function
