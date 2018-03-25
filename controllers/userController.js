const config = require('../config');
const jwt = require('jsonwebtoken');

exports.basicInfo = (req, res, next) => {
  try {
    const {
      username,
      jobname,
      date,
      email
    } = jwt.verify(req.cookies.jwt, config.jwtSecret, {
      maxAge: 60 * 60
    });

    res.json({ username, jobname, date, email });
  } catch (error) {
    return next();
  }
};
