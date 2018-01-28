const Job = require('../models/job');

exports.jobList = async (req, res) => {
  const { page, by } = req.query;
};

exports.job = async (req, res) => {
  const { id } = req.params;
};
