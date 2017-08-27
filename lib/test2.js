const config = require('../config');
const fetchJobs = require('../lib/fetch-jobs');

const mongoose = require('mongoose');
const JobRaw = require('../models/jobRaw.js');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

let i = 0;
let once = !!1;
let save = !!1;

let params = {
  // searchBy: {
  //   type: 'crew',
  //   id: '7870'
  // },
  once: once,
  period: 'today',
  // platform: 'ps3',
  limit: 300,
}

fetchJobs(params, jobs => {
  let total = (once) ? Math.min(jobs.Total, 20) : jobs.Total;
  let count = jobs.Count;
  console.log(`Should be ${total} jobs, ${jobs.Count} now [LIMIT: ` +
    `${params.limit}]; ONCE: ${once}, PLATFORM: ${params.platform}`);

  jobs.Missions.forEach(job => {

    if (save) {
      JobRaw.findOneAndUpdate(
        { jobId: job.MissionId },
        {
          jobId: job.MissionId,
          job: job,
          updated: new Date(),
          uploaded: false
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
          runSettersOnQuery: true
        },
        (err, doc) => {
          if (err) {
            console.log(`Error: ${err.code}`);
          }
          console.log(`${++i} -> \t ${job.MissionId}`);
        }
      );
    } else {
      console.log(`${++i} -> \t ${job.MissionId}`);
    }

  });

});
