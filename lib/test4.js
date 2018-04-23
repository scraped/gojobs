const { pitlaneAvailability } = require('./jobs/pitlane');
const RawJob = require('../models/raw-job');

((async () => {
  try {
    const jobs = await RawJob.find({ 'job.Metadata.nickname': 'Evil_Tuinhek' });

    jobs.forEach(job => {
      const available = pitlaneAvailability(job.job);
      if (available) {
        console.log(job.job.Metadata.name);
      }
    });
  } catch (error) {
    console.log('error:', error);
  }

  process.exit(0);
})());
