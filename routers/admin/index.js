const config = require('../../config');
const router = require('express').Router();
const fetchJobs = require('../../lib/fetch-jobs');

const mongoose = require('mongoose');
const JobRaw = require('../../models/jobRaw.js');
const Crew = require('../../models/Crew.js');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

module.exports = router;

router.get('/', (req, res) => {
  if (req.query.link === '') {
    res.send('Enter something');
  } else if (req.query.link) {
    const link = req.query.link;
    const isUser = link.match(/\s*\/member\/(\w+)\/\s*/);
    const isCrew = link.match(/\s*\?publisher=crew(\d+)\s*$/);
    const isJob = link.match(/\s*\/job\/(\w+)\s*$/);

    if (isUser) {
      fetchJobs({ member: isUser[1] });
      res.send(`Uploading jobs for user ${isUser[1]}`);
    } else if (isCrew) {
      fetchJobs({ crew: isCrew[1] });
      res.send(`Uploading jobs for crew ${isCrew[1]}`);
    } else if (isJob) {
      res.send(`Job ${isJob[1]}`);
    } else {
      res.send(`Error: counld't find anything.`);
    }
  } else {
    res.render('admin');
  }
});

router.get('/addcrew', (req, res, next) => {
  if (!Number(req.query.crewid)) {
    res.send('Incorrect crew ID.');
  } else {
    next();
  }
});

router.get('/addcrew', (req, res) => {
  const crewId = req.query.crewid;
  res.send(`We'll trying to add this crew to the database.`);

  fetchJobs({ searchBy: { type: 'crew', id: crewid }, once: true }, jobs => {
    jobs.Missions.forEach(job => {
      console.log(`Uploading job ${job.Content.Metadata.name}`);
      console.log({
        id: job.MissionId,
        linkName: job.Content.Metadata.crewurl.split('/')[2],
        abbr: job.Content.Metadata.crewtag,
        color: job.Content.Metadata.crewcolor,
      });
      // JobRaw.findOneAndUpdate(
      //   { id: job.MissionId },
      //   {
      //     id: job.MissionId,
      //     linkName: job.Content.Metadata.crewurl,
      //     abbr: job.Content.Metadata.crewtag,
      //     color: job.Content.Metadata.crewcolor,
      //   },
      //   { upsert: true },
      //   (err, doc, res) => {}
      // )
    });
  });
})
