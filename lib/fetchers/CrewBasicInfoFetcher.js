const BasicFetcher = require('./BasicFetcher');

class CrewBasicInfoFetcher extends BasicFetcher {
  async fetch({crewSlug}) {
    return await this.http({
      url: '/crew/byname',
      params: {
        name: crewSlug,
      },
    });
  }
}

module.exports = CrewBasicInfoFetcher;
