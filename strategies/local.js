const passport = require('passport');
const passportLocal = require('passport-local');
const LocalStrategy = passportLocal.Strategy;
const User = require('../models/user')

passport.use(new LocalStrategy(async (username, password, done) => {
  const BAD_CREDENTIALS_MESSAGE = 'Username or password is incorrect';

  try {
    const user = await User.findOne({ username });

    if (!user
      || !user.checkPassword(password)) {
      return done(null, false, { message: BAD_CREDENTIALS_MESSAGE })
    }
  } catch (e) {
    return done(e);
  }
}));
