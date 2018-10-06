const JobFetcher = require('./JobFetcher');
const fetchers = require('./BasicFetcher');

module.exports = {
  JobFetcher,
  ...fetchers,
};
