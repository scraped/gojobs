const mongoose = require('mongoose');
const Job = require('../models/job');
require('../models/job-details')
const _ = require('lodash');
// const axios = require('axios');

(async () => {
  try {
    const jobs = await Job.find().limit(1);

    const doc = jobs[0];

    doc.set({
      name: doc.name + '!!',
      slug: doc.slug + '!!'
    });

    await doc.save();

    console.log('saved')

    // console.log(jobs[0] instanceof mongoose.Document);
    // console.log(merged instanceof mongoose.Document);

    // console.log(Object.getPrototypeOf(merged));
  } catch (error) {
    console.log(error);
  }
})();
