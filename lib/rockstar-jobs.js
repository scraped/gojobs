const axios = require('axios');
const _ = require('lodash');

const JOBS_PER_RESPONSE = 20,
  JOBS_LIMIT = 100,
  baseURL = 'https://socialclub.rockstargames.com/',
  jobsPage = `/games/gtav`,
  cookieRegex = /=([^;]*)/,
  tokenRegex = /value="([a-z0-9_-]*)" \/>/mi,
  headers = {
    'Accept-Language': 'en-US,en',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
  };

module.exports = class RockstarJobs {
  constructor(params) {
    this.by = params.by || 'members';
    this.entityId = params.entityId;
    this.platform = params.platform || 'pc';
    this.period = params.period;
    this.skip = params.skip || 0;
    this.limit = _.clamp(Number(params.limit), JOBS_PER_RESPONSE, JOBS_LIMIT);
  }


};
