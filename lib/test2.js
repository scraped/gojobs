const config = require('../config');
const fetchJobs = require('../lib/fetch-jobs');

const mongoose = require('mongoose');
const JobRaw = require('../models/job-raw.js');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

let i = 0;
let once = !!0;
let save = !!1;

let params = {
  searchBy: {
    type: 'crew',
    id: '23512093'
  },
  once: once,
  // period: 'today',
  // platform: 'ps3',
  // limit: 300,
}

fetchJobs(params, jobs => {
  let total = (once) ? Math.min(jobs.Total, 20) : jobs.Total;
  let count = jobs.Count;
  console.log(`Should be ${total} jobs, ${jobs.Count} now [LIMIT: ` +
    `${params.limit}]; ONCE: ${once}, PLATFORM: ${params.platform}`);

  jobs.Missions.forEach(job => {
    let jobId = job.Content.Metadata.RootContentId;
    let jobCurrId = job.MissionId;

    if (save) {
      JobRaw.findOneAndUpdate(
        { jobId: job.MissionId },
        {
          jobId: jobId,
          jobCurrId: jobCurrId,
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
          console.log(`${++i} -> \t ${jobId}`);
        }
      );
    } else {
      console.log(`${++i} -> \t ${jobId}`);
    }

  });

});
