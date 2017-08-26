const config = require('../config');
const fetchJobs = require('../lib/fetch-jobs');

const mongoose = require('mongoose');
const JobRaw = require('../models/jobRaw.js');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

let i = 0;
let once = false;

let params = {
  // searchBy: {
  //   type: 'crew',
  //   id: '24587966'
  // },
  once: once,
  period: 'today',
  limit: 100
}

fetchJobs(params, jobs => {
  let total = (once) ? Math.min(jobs.Total, 20) : jobs.Total;
  let count = jobs.Count;
  console.log(`Should be ${total} jobs, ${jobs.Count} now`);

  jobs.Missions.forEach(job => {


    // JobRaw.findOneAndUpdate(
    //   { jobId: job.MissionId },
    //   {
    //     jobId: job.MissionId,
    //     job: job,
    //     updated: new Date()
    //   },
    //   {
    //     upsert: true,
    //     new: true,
    //     setDefaultsOnInsert: true,
    //     runSettersOnQuery: true
    //   },
    //   (err, doc) => {
    //     if (err) {
    //       console.log(`Error: ${err.code}`);
    //     }
    //     console.log(`${++i} \t ${job.MissionId}`);
    //   }
    // );

    console.log(`${++i} \t ${job.MissionId}`);

  });

});
