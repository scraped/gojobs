const router = require('express').Router();
const User = require('../models/user');
const { signUp, completeSignUp, jobName } = require('../controllers/userController');

module.exports = router;

router.post('/signup', signUp);
router.post('/completesignup', completeSignUp);
router.get('/jobname', jobName);
