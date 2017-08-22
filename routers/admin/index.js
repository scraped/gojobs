const config = require('../../config');
const router = require('express').Router();
const fetchJobs = require('../../lib/fetch-jobs');

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
})
