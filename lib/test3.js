const JobRaw = require('../models/raw-job');
const config = require('../config');

async function test() {
  let jobs = await JobRaw.find();

  // jobs.forEach(async job => {
  //   let { jobId, updated } = job.toObject();

  //   await JobRaw.findOneAndUpdate(
  //     { jobId },
  //     { dates: { fetch: updated } },
  //     config.mongo.standardUpdateOptions
  //   );
  // });
}

test();
