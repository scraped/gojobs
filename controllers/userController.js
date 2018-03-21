const config = require('../config');
const jwt = require('jsonwebtoken');

exports.basicInfo = (req, res, next) => {
  try {
    const {
      username,
      jobname
    } = jwt.verify(req.cookies.jwt, config.jwtSecret, {
      maxAge: 60 * 60
    });

    res.json({ username, jobname });
  } catch (error) {
    return next();
  }
};
