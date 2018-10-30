const BasicFetcher = require('./BasicFetcher');

class JobListFetcher extends BasicFetcher {
  async fetch({type, id, plat, pageIndex = 0}) {
    let params = {
      sort: 'date',
      pageIndex,
      pageSize: 30,
      includeCommentCount: false,
      title: 'gtav',
    };

    if (plat) {
      params.platform = plat;
    }

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

module.exports = JobListFetcher;
