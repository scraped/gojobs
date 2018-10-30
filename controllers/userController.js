const jwt = require('jsonwebtoken');
const config = require('../config');

exports.basicInfo = (req, res) => {
  try {
    const {username, jobname, date, email} = jwt.verify(req.cookies.jwt, config.jwtSecret, {
      maxAge: 60 * 60,
    });

    res.json({username, jobname, date, email});
  } catch (error) {
    res.json();
  }
};
