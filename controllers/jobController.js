const mongoose = require('../lib/db');
const { uploadRawJobs } = require('../lib/jobs/upload-rawjobs');
const { fetchAndSave } = require('../lib/jobs/fetch');
const Job = require('../models/job');
const Crew = require('../models/crew');
const User = require('../models/user');

exports.jobsList = async function(req, res) {
  let options = {};

  let {
    page,
    perPage,
    by,
    byId,
    platform,
    gameType,
    maxpl
  } = req.query;

  page = Number(page) || 1;
  perPage = Number(perPage) || 30;
  platform = Number(platform) || 1;
  gameType = Number(gameType) || 0;
  maxpl = Number(maxpl) || 0;

  options.platform = platform;
  if (gameType) options['job.gameType'] = gameType;
  if (maxpl) options['job.maxpl'] = { $lte: maxpl };

  let number = 0;
  let empty = false;
  let sort = { 'stats.points': -1 };

  if (by === 'featured') {
    options.starred = true;
  } else if (by === 'updated') {
    sort = { 'dates.updated': -1 };
  } else if (by === 'added') {
    sort = { 'dates.added': -1 };
  } else if (by === 'user') {
    let info = await User.findOne({ username: byId });
    if (!info) empty = true;
    if (info) options.author = byId;
  } else if (by === 'crew') {
    let info = await Crew.findOne({ crewUrl: byId });
    if (!info) empty = true;
    if (info) options.crew = mongoose.Types.ObjectId(info._id);
  }

  if (!empty) {
    number = await Job.count(options);
    if (!number) empty = true;
  }

  if (empty) {
    return res.json({ number: 0 });
  }

  let jobs = await Job.find(options)
    .skip(Math.abs((page - 1) * perPage))
    .limit(perPage)
    .sort(sort);

  jobs = jobs.map(job => job.toObject());

  res.json({ number, jobs });
};

exports.jobDetails = async function(req, res) {
  const jobId = req.params.id;

  const job = await Job.findOne({ jobId })
    .populate('details');

  res.json({
    job: job.toObject()
  });
};

exports.jobsUpload = function(req, res) {
  const { limit, forced } = req.body;

  uploadRawJobs({ limit, forcedUpload: forced });

  res.send(`Jobs are being uploaded.`);
};

exports.jobsFetch = function(req, res) {
  fetchAndSave(req.body);

  res.send(`Jobs are being fetched.`);
};
