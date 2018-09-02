const router = require('express').Router();

const {
  profileDetails
} = require('../controllers/profileController');

const {
  signUp,
  logIn,
  logOut,
  recoveryPass,
  verify,
} = require('../controllers/authController');

const {
  jobListPost,
  rawJobsListPost,
  jobDetailsPost,
  jobUploadPost,
  jobsFetchPost,
} = require('../controllers/job');

const {
  basicInfo
} = require('../controllers/userController');

const {
  crewListPost,
  fetchCrewPost
} = require('../controllers/crewController');

function todoController(req, res) {
  res.json({
    message: `TODO: ${req.method} ${req.path}`
  })
}

// Profile
router.get('/profile/:username', profileDetails);

// Auth
router.post('/auth/signup', signUp);
router.post('/auth/login', logIn);
router.post('/auth/logout', logOut);
router.post('/auth/recovery', recoveryPass);
router.post('/auth/verify', verify);

// User
router.post('/user/basicinfo', basicInfo);

// Job
router.post('/jobs', jobListPost);
router.post('/jobs/raw', rawJobsListPost);
router.post('/jobs/fetch', jobsFetchPost);
router.post('/jobs/upload', jobUploadPost);
router.post('/jobs/:id', jobDetailsPost);

// Crew
router.post('/crews', crewListPost);
router.post('/crews/fetch', fetchCrewPost);

module.exports = router;
