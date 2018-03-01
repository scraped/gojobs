const passport = require('passport');
const passportLocal = require('passport-local');
const LocalStrategy = passportLocal.Strategy;
const User = require('../models/user')

passport.use(new LocalStrategy(async (username, password, done) => {
  const BAD_CREDENTIALS_MESSAGE = 'Username or password is incorrect';
  let user;

  try {
    user = await User.findOne({ username });
  } catch (e) {
    return done(e);
  }

  if (!user) {
    return done(null, false, { message: BAD_CREDENTIALS_MESSAGE })
  }

  if (user.)
}));
