const config = require('../config');

const mongoose = require('mongoose');
const JobRaw = require('../models/job-raw');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

let tr = {};

// job.job.Content.Metadata.data.mission.gen.
JobRaw.find((err, jobs) => {
  let i = 0, found = 0; errors = 0;
  jobs.forEach(job => {
    jobId = job.jobId;
    job = job.job;
    name = job.Content.Metadata.name;

    try {
      ++i;

      // if (jobId !== job.Content.Metadata.RootContentId) {
        ++found;

        console.log(`${i} \t ${jobId}`
          // + `, ${job.Content.Metadata.data.mission.gen.mode}`
          + `\t\t ${name} https://ru.socialclub.rockstargames.com/games/gtav/pc/jobs/job/${job.Content.Metadata.RootContentId}`
          // + `\t ${job.Content.Metadata.data.mission.race.rdis}`
          // + `\t ${job.Content.Metadata.data.meta.vehcl} `
          // + `\t ${tr[job.Content.Metadata.data.meta.ems]=true}`
        );
        // console.log(job);
      // }
    } catch (e) {
      errors++;
      console.log(`${e}`);
    }
  });

  console.log(`Showing ${found} of ${i}`);
  console.log(`Total errors: ${errors}`);
  console.log(tr);
});
