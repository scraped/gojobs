const _ = require('lodash');
const User = require('../models/user');

exports.userInfo = function(req, res) {
  const { username, job } = req.session;
  return res.json({
    cookies: { username, job }
  });
};

exports.signUp = async function(req, res, next) {
  const NO_USERNAME_MESSAGE = 'Enter a username',
    USER_NOT_FOUND_MESSAGE = 'User not found',
    USER_EXISTS_MESSAGE = 'This user has already registred';

  if (req.session.job) {
    return next();
  }

  const { username } = req.body;

  if (!username) {
    return res.status(401).json({ message: NO_USERNAME_MESSAGE });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: USER_NOT_FOUND_MESSAGE });
  }

  if (user.verified) {
    return res.status(401).json({ message: USER_EXISTS_MESSAGE });
  }

  const jobname = User.generateTestJobName();

  req.session.username = username;
  req.session.job = jobname;

  return res.json({ jobname });
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
