const config = require('../config');

const mongoose = require('mongoose');
const JobRaw = require('../models/jobRaw');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

JobRaw.find((err, jobs) => {
  let i = 0, errors = 0;
  jobs.forEach(job => {
    try {
      console.log(`${++i} \t ${job.job.MissionId} \t ${job.job.Content.Metadata.latest}`);
    } catch (e) {
      errors++;
      // console.log(`Error: ${e}`);
    }
  });
  console.log(`Total errors: ${errors}`)
});
