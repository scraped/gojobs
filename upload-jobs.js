const mongoose = require("mongoose");
mongoose.connect("mongodb://andrew:qwerty@ds157521.mlab.com:57521/goj-jobs", {
  useMongoClient: true,
});
const Job = require("./models/jobs.js");

// jobs is array
const jobs = require("./response-example.json").Missions;

// console.log(jobs);

jobs.forEach(job => {
  new Job({
    jobID:    job.MissionID,
    name:     job.Content.Metadata.name,
    desc:     job.Content.Metadata.desc,
    image:    job.Content.Metadata.thumbnail,
    gamemode: job.Content, // todo
    platform: job.Content, // todo

    creator: {
      nickname: job.Content,
      medal:    job.Content,
      crew: {
        tag:  job.Content,
        rank: job.Content,
        color: {
          type: job.Content,
          default: "000000"
        }
      }
    },

    ratings: {
      playedTotal:  job.Content,
      playedUnique: job.Content,
      quitTotal:    job.Content,
      quitUnique:   job.Content,
      likes:        job.Content,
      dislikes:     job.Content,
      rating:       job.Content,
    },

    updated: {
      date:    job.Content,
      version: job.Content
    },
  }).save();
});
