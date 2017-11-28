const config = require('../../config');
const router = require('express').Router();
const uploadJobs = require('../../lib/upload-jobs');
const Boom = require('boom');

const mongoose = require('../../lib/db');
const User = require('../../models/user');
const Crew = require('../../models/crew');
const Job = require('../../models/job');

module.exports = router;

router.get('/', async (req, res) => {
  let options = {};

  let {
    page,
    perPage,
    author,
    crewUrl,
    platform,
    gameType,
    gameMode,
    maxpl
  } = req.query;

  page = Number(page) || 1;
  perPage = Number(perPage) || config.perPage;
  platform = Number(platform) || 1;
  gameType = Number(gameType) || 0;
  gameMode = Number(gameMode) || 0;
  maxpl = Number(maxpl) || 0;

  options.platform = platform;
  if (gameType) options['job.gameType'] = gameType;
  if (gameMode) options['job.gameMode'] = gameMode;
  if (maxpl) options['job.maxpl'] = { $lte: maxpl };

  let amount = 0;
  let empty = false;

  if (author) {
    let info = await User.findOne({ username: author });
    if (!info) empty = true;
    options.author = mongoose.Types.ObjectId(info._id);
  } else if (crewUrl) {
    let info = await Crew.findOne({ crewUrl });
    if (!info) empty = true;
    options.crew = mongoose.Types.ObjectId(info._id);
  }

  if (!empty) {
    amount = await Job.count(options);
    if (!amount) empty = true;
  }

  if (empty) {
    return res.json({ amount: 0 });
  }

  let jobs = await Job.find(options)
    .skip(Math.abs((page - 1) * perPage))
    .limit(perPage)
    .sort({ 'stats.points': -1 })
    .populate('author')
    .populate('crew');

  jobs = jobs.map(job => job.toObject());

  res.json({ amount, jobs });
});

router.get('/id/:id', async (req, res, next) => {
  let { id } = req.params;

  try {
    let job = await Job.findOne({ jobId: id })
      .populate('author')
      .populate('crew');

    res.json(job.toObject());
  } catch (e) {
    return next(Boom.notFound('Job not found'));
  }
});

router.get('/upload', async (req, res) => {
  try {
    await uploadJobs();
  } catch (e) {
    console.log('Error while uploading jobs:', e.stack);
  }

  res.send('Jobs uploaded');
});
