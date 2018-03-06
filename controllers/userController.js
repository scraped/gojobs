const _ = require('lodash');
const User = require('../models/user');

exports.signUp = async function(req, res, next) {
  if (req.session.job) {
    return next();
  }

  const { username } = req.body;

  if (!username) {
    return res.json({ message: 'Enter a username.' });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.json({ message: 'User not found. You can\'t sign up at this moment.' });
  }

  if (user.verified) {
    return res.json({ message: 'This user has already registred.' });
  }

  const jobname = User.generateTestJobName();

  req.session.username = username;
  req.session.job = jobname;

  return res.json({
    success: true,
    jobname
  });
};

exports.completeSignUp = async function(req, res, next) {
  if (req.session.job) {
    return next();
  }

  const MIN_USERNAME_LEN = 6,
    MAX_USERNAME_LEN = 16,
    MIN_PASSWORD_LEN = 6,
    MAX_PASSWORD_LEN = 30;

  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.json({ message: 'Enter username and password' });
  }

  if (_.inRange(username.length, MIN_USERNAME_LEN, MAX_USERNAME_LEN + 1)
    || _.inRange(password.length, MIN_PASSWORD_LEN, MAX_PASSWORD_LEN + 1)) {
    return res.json(
      { message: 'Too short or too long username or/and password' }
    );
  }
};
