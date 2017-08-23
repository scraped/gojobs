const config = require('../../config');
const router = require('express').Router();
const request = require('request-promise');
const fetchJobs = require('../../lib/fetch-jobs');

const mongoose = require('mongoose');
const Crew = require('../../models/Crew.js');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

module.exports = router;

router.get('/', (req, res) => {
  Crew.find((err, crews) => {
    if (err) return next('Cannot fetch data from database');
    res.locals.partials.crewsContext = crews;
    res.render('admin');
  });
});

router.get('/addcrew', (req, res, next) => {
  let url = req.query.url.trim();
  if (!url) return next('Enter a link to the crew page.');

  let urlMatch = url.match(/\s*crew\/([\w-]+)\s*$/);
  if (!urlMatch) return next('Incorrect link');

  let crew = {};
  crew.url = url.split('/')[4];

  request(`https://socialclub.rockstargames.com/crew/${crew.url}`)
    .then(body => {
      let idAndAvatarMatch = body.match(/crews\/sc\/(\d+)\/(\d+)\/publish\//);
      let nameMatch = body.match(/\\"crewname\\":\\"([\w -]+)\\"/);
      let tagMatch = body.match(/\\"tag\\":\\"(\w+)\\"/);
      let colorMatch = body.match(/\\"crewColor\\":\\"#(\w+)\\"/);

      if (!idAndAvatarMatch || !nameMatch || !tagMatch || !colorMatch) {
        return next(`Cannot find the '${crew.url}' crew`);
      }

      crew.crewId = idAndAvatarMatch[2];
      crew.name = nameMatch[1];
      crew.tag = tagMatch[1];
      crew.color = colorMatch[1];
      crew.avatar = idAndAvatarMatch[1];
      crew.updated = new Date();

      Crew.findOneAndUpdate(
        { crewId: crew.crewId },
        crew,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
          runSettersOnQuery: true
        },
        (err, doc) => {
          if (err) {
            console.log(err);
            return next(`Error ${err.code} occured. Try again later`);
          }
          res.send(`Crew '<a href="https://socialclub.rockstargames.com/crew/${crew.url}" target="_blank">${crew.name}</a>' has been successfully added/updated.`);
        }
      );
    })
    .catch(next);
});
