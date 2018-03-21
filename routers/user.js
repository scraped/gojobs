const router = require('express').Router();
const { basicInfo } = require('../controllers/userController');
const passport = require('passport');

module.exports = router;

const authNeeded = passport.authenticate('jwt', { session: false });

router.post('/basicinfo', basicInfo);
