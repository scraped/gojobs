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

class JobFetcher extends BasicFetcher {
  async fetch({jobId}) {
    return await this.http({
      url: '/ugc/mission/details',
      params: {
        title: 'gtav',
        contentId: jobId,
      },
    });
  }
}

class JobListFetcher extends BasicFetcher {
  async fetch({type, id, plat, pageIndex = 0}) {
    let params = {
      platform: plat,
      sort: 'date',
      pageIndex,
      pageSize: 30,
      includeCommentCount: false,
    };

    switch (type) {
      case 'rockstar':
        if (id === 'rockstar') params.filter = 'rockstar';
        if (id === 'verified') params.filter = 'rockstarVerified';
        break;

      case 'user':
        params.creatorRockstarId = id;
        break;

      case 'crew':
        params.filter = 'crew';
        params.crewId = id;
        break;

      default:
    }

    return await this.http({
      url: '/search/mission',
      params,
    });
  }
}

class CrewFetcher extends BasicFetcher {
  async fetch({crewSlug}) {
    return await this.http({
      url: '/crew/byname',
      params: {
        name: crewSlug,
      },
    });
  }
}

module.exports = {
  BasicFetcher,
  JobFetcher,
  JobListFetcher,
  CrewFetcher,
};
