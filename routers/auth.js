const router = require('express').Router();
const { signUp } = require('../controllers/authController');

module.exports = router;

router.post('/signup', signUp);
