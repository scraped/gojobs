const router = require('express').Router();
const { profileDetails } = require('../controllers/profileController');

module.exports = router;

router.get('/profile/:username', profileDetails);
