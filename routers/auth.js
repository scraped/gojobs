const router = require('express').Router();
const User = require('../models/user');
const { signUp } = require('../controllers/userController');

module.exports = router;

router.post('/signup', signUp);

router.post('/login', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.json({ message: 'Enter username and password' });
  }

  const user = await User.findOne({ username });
});
