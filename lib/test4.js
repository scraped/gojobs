const mongoose = require('mongoose');
const Job = require('../models/job');
const RawJob = require('../models/raw-job');
require('../models/job-details')
const _ = require('lodash');
const fs = require('fs');
// const axios = require('axios');

(async () => {
  try {
    let props = JSON.parse(fs.readFileSync('./props.json')) || [];

    const jobs = await RawJob.find({ extended: true }).skip(15000);

    jobs.forEach(job => {
      const propObject = job.job.Metadata.data.mission.prop;

      if (!propObject) return;

      const propsNames = propObject.model;

      propsNames.forEach(prop => {
        if (!props.includes(prop)) {
          props.push(prop);
        }
      });
    });

    fs.writeFileSync('./props.json', JSON.stringify(props.sort()));

    console.log(props);
  } catch (error) {
    console.log(error);
  }
})();
