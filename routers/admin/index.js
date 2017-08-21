const config = require('../../config');
const router = require('express').Router();
const fetchJobs = require('../../lib/fetch-jobs');

module.exports = router;

router.get('/addcrew', (req, res, next) => {
  let crewId = req.query.id;
  console.log(typeof crewId);
  if (crewId === '') res.send('1');
  res.send(crewId);
});

router.get('/', (req, res) => {
  if (req.query.link === '') {
    res.set('Content-Type', 'text/plain');
    res.send('Enter something');
  } else if (req.query.link) {
    const link = req.query.link;
    const isUser = link.match(/\s*\/member\/(\w+)\/\s*/);
    const isCrew = link.match(/\s*\?publisher=crew(\d+)\s*$/);
    const isJob = link.match(/\s*\/job\/(\w+)\s*$/);

    res.set('Content-Type', 'text/plain');

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
