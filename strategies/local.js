const passport = require('passport');
const passportLocal = require('passport-local');

const LocalStrategy = passportLocal.Strategy;
const {User} = require('../models');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({username});

      if (!user || !user.checkPassword(password)) {
        return done(null, false, {message: 'Username or password is incorrect'});
      }
    } catch (e) {
      return done(e);
    }
  }),
);
