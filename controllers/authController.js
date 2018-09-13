const config = require('../config');
const _ = require('lodash');
const validator = require('validator');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const Boom = require('boom');

const {User} = require('../models');

exports.verify = (req, res) => {
  return res.json({
    message: 'TODO auth verify'
  });
};

exports.logIn = (req, res) => {
  return res.json({
    message: 'TODO auth log in'
  });
};

exports.logOut = (req, res) => {
  return res.json({
    message: 'TODO auth log out'
  });
};

exports.recoveryPass = (req, res) => {
  return res.json({
    message: 'TODO recovery pass'
  });
};
