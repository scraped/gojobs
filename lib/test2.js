const Job = require('../models/job');
const JobDetails = require('../models/job-details');

(async () => {
  try {
    const jobs = await JobDetails.find();

    let len = 0;

    jobs.forEach(job => {
      len += job.desc.length;
    });

    console.log(`Av len: ${len / jobs.length}`);

    process.exit(0);
  } catch (error) {
    console.log('error:', error);
  }
})();
