const Job = require('../models/job');
require('../models/job-details');

(async () => {
  try {
    const jobs = await Job.find();

    await Promise.all(jobs.map(job => {
      job.set({
        fetchDate: job.fetchDate || new Date(0)
      });
      return job.save();
    }));

    console.log('complete!');

    process.exit(0);
  } catch (error) {
    console.log('error:', error);
  }
})();
