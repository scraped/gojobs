const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');

const strategyOptions = {
  secretOrKey: 'supersecretKeyy',
  jwtFromRequest: ExtractJwt.fromAuthHeader()
};

const strategy = new Strategy(strategyOptions, (payload, done) => {

  }
);

passport.use(strategy);
