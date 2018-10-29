const BasicFetcher = require('./BasicFetcher');

class JobNewFormatFetcher extends BasicFetcher {
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

module.exports = JobNewFormatFetcher;
