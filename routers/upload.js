const config  = require('../config');
const express = require('express');
const router  = express.Router();
const uploadJobs = require('../lib/upload-jobs');

router.get('/upld', (req, res) => {
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
      uploadJobs({ member: isUser[1] });
      res.send(new Date() + ': uploading jobs for user ' + isUser[1]);
    } else if (isCrew) {
      uploadJobs({ crew: isCrew[1] });
      res.send(new Date() + ': uploading jobs for crew ' + isCrew[1]);
    } else if (isJob) {
      res.send('Job: ' + isJob[1]);
    } else {
      res.send('Error: counld\'t find anything.');
    }
  } else {
    res.render('upload');
  }
});

module.exports = router;
