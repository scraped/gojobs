const axios = require('axios');

class BasicFetcher {
  constructor() {
    this.http = axios.create({
      baseURL: 'https://scapi.rockstargames.com',
      headers: {
        'x-requested-with': 'XMLHttpRequest',
        'x-amc': true,
        'x-lang': 'en-US',
      },
    });
  }

  async fetch(params) {
    return await this.http(params);
  }
}

module.exports = BasicFetcher;
