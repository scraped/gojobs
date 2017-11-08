const fetchJobs = require('./fetch-jobs-beta');

fetchJobs({}).then(result => {
  console.log(result);
}).catch(e => console.log(e));
