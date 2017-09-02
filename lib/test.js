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

      let capitalized = 0, words = 1;
      let nameLength = name.length;
      for (let i = 0; i < nameLength; i++) {
        if (name[i].match(/\w/i) && name[i] === name[i].toUpperCase()) {
          capitalized++;
        }
        if (name[i] === ' ') words++;
      }
      capitalized = Math.max(capitalized - words, 0);

      // if (name[0].match(/[^\w]/)) {
        ++found;

        console.log(`${i} \t ${jobId}`
          // + `, ${job.Content.Metadata.data.mission.gen.mode}`
          + `\t\t ${capitalized}/${nameLength} \t ${name}`
          // + `\t ${job.Content.Metadata.data.mission.race.rdis}`
          // + `\t ${job.Content.Metadata.data.meta.vehcl} `
          // + `\t ${tr[job.Content.Metadata.data.meta.ems]=true}`
        );
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
