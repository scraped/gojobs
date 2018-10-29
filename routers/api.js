const asyncHandler = require('express-async-handler');
const router = require('express').Router();

const {
  profileDetails,
} = require('../controllers/profileController');

// const {
//   signUpPost,
// } = require('../controllers/auth');

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
  // jobUploadPost,
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
router.get('/profile/:username', asyncHandler(profileDetails));

// Auth
router.post('/auth/signup', asyncHandler(signUp));
router.post('/auth/login', asyncHandler(logIn));
router.post('/auth/logout', asyncHandler(logOut));
router.post('/auth/recovery', asyncHandler(recoveryPass));
router.post('/auth/verify', asyncHandler(verify));

// User
router.post('/user/basicinfo', asyncHandler(basicInfo));

// Job
router.post('/jobs', asyncHandler(jobListPost));
router.post('/jobs/raw', asyncHandler(rawJobsListPost));
router.post('/jobs/fetch', asyncHandler(jobsFetchPost));
router.post('/jobs/:id', asyncHandler(jobDetailsPost));

// Crew
router.post('/crews', asyncHandler(crewListPost));
router.post('/crews/fetch', asyncHandler(fetchCrewPost));

module.exports = router;
