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
  jobDetailsPost,
  jobUploadPost,
  jobFetchPost,
  jobFetchExtendedPost
} = require('../controllers/job');

const {
  basicInfo
} = require('../controllers/userController');

const {
  crewList
} = require('../controllers/crewController');

module.exports = router;

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
router.post('/job/fetch', jobFetchPost);
router.post('/job/fetchextended', jobFetchExtendedPost);
router.post('/job/fetched', todoController);
router.post('/job/upload', jobUploadPost);
router.post('/job/:id', jobDetailsPost);

// Crew
router.post('/crews', crewList);
