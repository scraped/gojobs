const router = require('express').Router();

const {
  jobsList,
  jobDetails,
  jobsUpload,
  jobsFetch
} = require('../controllers/jobController');

router.post('/', jobsList);
router.post('/id/:id', jobDetails);
router.post('/upload', jobsUpload);
router.post('/fetch', jobsFetch);

module.exports = router;
