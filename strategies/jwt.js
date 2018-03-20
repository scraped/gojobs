const passport = require('passport');
const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy;
const { ExtractJwt } = passportJwt;
const User = require('../models/user');

const strategyOptions = {
  secretOrKey: 'supersecretKeyy',
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // passport-jwt is verifying the token using jsonwebtoken. Pass here an
  // options object for any other option you can pass the jsonwebtoken
  // verifier. (i.e maxAge)
  // see https://github.com/auth0/node-jsonwebtoken
  jsonWebTokenOptions: {
    maxAge: '7d'
  }
};

passport.use(new JwtStrategy(strategyOptions, async (payload, done) => {
  const { username } = payload;

  if (!username) {
    return done(null, false);
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (e) {
    return done(e);
  }
}));
