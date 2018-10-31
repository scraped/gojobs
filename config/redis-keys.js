module.exports = {
  rgscFetchCredentials(platform) {
    return `rgsc-fetcher:credentials:${platform}`;
  },

  rgscFetchDelay: 'rgsc-fetcher:delay',
};
