const router = require('express').Router();
const User = require('../models/user');
const { signUp, completeSignUp, userInfo } = require('../controllers/userController');

module.exports = router;

router.post('/signup', signUp);
router.post('/completesignup', completeSignUp);
router.get('/cookies', userInfo);
