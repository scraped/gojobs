const _ = require('lodash');
const User = require('../models/user');

exports.signUp = async function(req, res, next) {
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
    return res.json({ message: 'Too short or too long username or/and password' });
  }

  try {
    const user = await User.findOne({ username });

    if (user) {
      return res.json({ message: 'User already exists' });
    }

    if (email) {
      const emailExists = await User.findOne({ email });

      if (emailExists) {
        return res.json({ message: 'This email is used by another user' });
      }
    }


  } catch (e) {
    return next(e);
  }
};
