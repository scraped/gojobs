const ash = require('express-async-handler');
const router = require('express').Router();

const {
  profileDetails,
} = require('../controllers/profileController');

const {
  signUpPost,
} = require('../controllers/auth');

const {
  jobListPost,
  rawJobsListPost,
  jobDetailsPost,
  jobsFetchPost,
} = require('../controllers/job');

const {
  basicInfo,
} = require('../controllers/userController');

const {
  crewListPost,
  fetchCrewPost,
} = require('../controllers/crewController');

// Profile
router.get('/profile/:username', ash(profileDetails));

// Auth
router.post('/auth/signup', ash(signUpPost));

// User
router.post('/user/basicinfo', ash(basicInfo));

// Job
router.post('/jobs', ash(jobListPost));
router.post('/jobs/raw', ash(rawJobsListPost));
router.post('/jobs/fetch', ash(jobsFetchPost));
router.post('/jobs/:id', ash(jobDetailsPost));

// Crew
router.post('/crews', ash(crewListPost));
router.post('/crews/fetch', ash(fetchCrewPost));

module.exports = router;
