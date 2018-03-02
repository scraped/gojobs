const passport = require('passport');
const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy;
const { ExtractJwt } = passportJwt;

const strategyOptions = {
  secretOrKey: 'supersecretKeyy',
  jwtFromRequest: ExtractJwt.fromAuthHeader()
};

passport.use(new JwtStrategy(strategyOptions, (payload, done) => {

  }
));
