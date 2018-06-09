const Job = require('../models/job');

(async () => {
  try {
    const jobs = await Job.find();

    jobs.forEach(job => {
      job.stats.growth = job.stats.trend = 1;
    });

    await Promise.all(jobs.map(job => job.save()));

    process.exit(0);
  } catch (error) {
    console.log('error:', error);
  }
})();
