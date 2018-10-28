module.exports = {
  fetchJobs(platform) {
    return `rgsc-jobs-fetcher_${platform}`;
  },

  jobsToFetch: 'jobs-to-fetch',
};
