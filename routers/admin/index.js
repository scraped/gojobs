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
  if (!(req.query.url)) {
    res.send('Enter URL.');
  } else {
    next();
  }
});

router.get('/addcrew', (req, res) => {
  let url = req.query.url;
  let urlMatch = url.match(/\s*\?publisher=crew(\d+)\s*$/);
  if (!urlMatch) {
    res.send('Incorrect link');
    return;
  }
  let crewId = urlMatch[1];
  let crewLinkName = url.split('/')[4];
  res.send(`We'll trying to add this crew (${crewId}) to the database.`);

  let foundCrewInfo = false;

  fetchJobs({ searchBy: { type: 'crew', id: crewId } }, jobs => {
    jobs.Missions.forEach(job => {
      if (foundCrewInfo) return;
      if (crewLinkName === job.Content.Metadata.crewurl.split('/')[2]) {
        console.log(`Found information about '${crewLinkName}' crew`);
        foundCrewInfo = true;
        new Crew({
          crewId: crewId,
          linkName: crewLinkName,
          abbr: job.Content.Metadata.crewtag,
          color: job.Content.Metadata.crewcolor,
          updated: new Date()
        }).save();
        // Crew.findOneAndUpdate(
        //   { crewId: crewId },
        //   {
        //     crewId: crewId,
        //     linkName: crewLinkName,
        //     abbr: job.Content.Metadata.crewtag,
        //     color: job.Content.Metadata.crewcolor,
        //     updated: new Date()
        //   },
        //   { upsert: true },
        //   console.log
        // );
      }
    });
  });
});
