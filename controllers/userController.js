const config = require('../config');
const jwt = require('jsonwebtoken');

exports.basicInfo = (req, res) => {
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
    res.json();
  }
};
