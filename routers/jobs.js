const router = require('express').Router;
const jobController = require('../controllers/jobController');

router.get('/', jobController.jobList);
router.get('/id/:id', jobController.jobDetails);
router.post('/upload', jobController.jobUpload);

module.exports = router;
