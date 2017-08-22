const fetchJobs = require('./fetch-jobs');

fetchJobs({ searchBy: { type: 'crew', id: '19208361' } }, jobs => {
  console.log(`Jobs:: ${jobs.Missions}`);
});
