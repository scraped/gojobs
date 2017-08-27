const config = require('../config');

const mongoose = require('mongoose');
const JobRaw = require('../models/jobRaw');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

let tr = {};

// job.job.Content.Metadata.data.mission.gen.
JobRaw.find((err, jobs) => {
  let i = 0, errors = 0;
  jobs.forEach(job => {
    try {
      ++i;
      console.log(`${i} \t ${tr[job.job.Content.Metadata.data.mission.gen.tnum]=true}`);
    } catch (e) {
      errors++;
      // console.log(`Error: ${e}`);
    }
  });
  console.log(`Total errors: ${errors}`);
  console.log(tr);
});
