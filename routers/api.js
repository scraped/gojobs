const router = require('express').Router();
const {profileDetails} = require('../controllers/profileController');

const {
  signUp,
  logIn,
  logOut,
  recoveryPass,
  verify,
} = require('../controllers/authController');

const {
  jobList,
  jobDetails,
  jobUpload,
  jobFetch
} = require('../controllers/jobController');

const {basicInfo} = require('../controllers/userController');

module.exports = router;

// const authNeeded = passport.authenticate('jwt', { session: false });

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
router.post('/jobs', jobList);
router.post('/job/upload', jobUpload);
router.post('/job/fetch', jobFetch);
router.post('/job/:id', jobDetails);
