const router = require('express').Router();

const {
  jobList,
  jobDetails,
  jobUpload
} = require('../controllers/jobController');

router.get('/', jobList);
router.get('/id/:id', jobDetails);
router.post('/upload', jobUpload);

module.exports = router;
