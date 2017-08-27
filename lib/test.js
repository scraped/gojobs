const config = require('../config');

const mongoose = require('mongoose');
const JobRaw = require('../models/jobRaw');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

let tr = {};

// job.job.Content.Metadata.data.mission.gen.
JobRaw.find((err, jobs) => {
  let i = 0, errors = 0;
  jobs.forEach(job => {
    jobId = job.jobId;
    job = job.job;
    try {
      ++i;
      // if (job.Content.Metadata.data.meta.ems)
      console.log(`${i} \t ${jobId}, ${job.Content.Metadata.data.mission.gen.mode}`
        + `\t\t ${job.Content.Metadata.data.meta.mrule}`
        // + `\t ${job.Content.Metadata.data.mission.race.rdis}`
        // + `\t ${job.Content.Metadata.data.meta.vehcl} `
        // + `\t ${tr[job.Content.Metadata.data.meta.ems]=true}`
      );
    } catch (e) {
      errors++;
      // console.log(`Error: ${e}`);
    }
  });
  console.log(`Total errors: ${errors}`);
  console.log(tr);
});
