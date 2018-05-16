const RawJob = require('../models/raw-job');

(async () => {
  try {
    const rawJobs = await RawJob.find();

    console.log('here');
    await Promise.all(rawJobs.map(rawJob => {
      return RawJob.findOneAndUpdate(
        { jobId: rawJob.jobId },
        { processed: false }
      );
    }));
  } catch (error) {
    console.log(error);
  }


  console.log('done');
})();
