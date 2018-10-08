const {JobFetcher} = require('../fetchers');

(async () => {
  const jobId = '6H2sE14Wpku2MoAQ7L7WGg';

  const http = new JobFetcher();

  const rgscJob = (await http.fetch({jobId})).data;

  console.log('job:', rgscJob);
})();
