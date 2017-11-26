const config = require('../../config');
const router = require('express').Router();
const mongoose = require('../../lib/db');
const uploadJobs = require('../../lib/upload-jobs');

const User = require('../../models/user');
const Crew = require('../../models/crew');
const Job = require('../../models/job');

module.exports = router;

router.get('/', async (req, res) => {
  let searchOptions = {};

  let {
    page = 1,
    perPage = config.perPage,
    author,
    crewUrl,
    platform = 1,
    gameType,
    gameMode,
    maxpl
  } = req.query;

  page = Number(page);
  perPage = Number(perPage);
  platform = Number(platform);
  gameType = Number(gameType);
  gameMode = Number(gameMode);
  maxpl = Number(maxpl);

  searchOptions.platform = platform;
  if (gameType) searchOptions['job.gameType'] = gameType;
  if (gameMode) searchOptions['job.gameMode'] = gameMode;
  if (maxpl) searchOptions['job.maxpl'] = { $lte: maxpl };

  let authorOrCrewPromise = Promise.resolve();

  if (author) {
    authorOrCrewPromise = User.findOne({ username: author });
  } else if (crewUrl) {
    authorOrCrewPromise = Crew.findOne({ crewUrl });
  }

  let authorOrCrew = await authorOrCrewPromise;

  if (authorOrCrew) {
    if (author) {
      searchOptions.author = mongoose.Types.ObjectId(authorOrCrew._id)
    } else {
      searchOptions.crew = mongoose.Types.ObjectId(authorOrCrew._id);
    }
  }

  let amount = await Job.count(searchOptions);

  let jobs = await Job.find(searchOptions)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ 'stats.points': -1 })
    .populate('author')
    .populate('crew');

  jobs = jobs.map(job => job.toObject());

  res.json({ amount, jobs });
});

router.get('/id/:id', async (req, res) => {
  let { id } = req.params;

  try {
    let job = await Job.findOne({ jobId: id })
      .populate('author')
      .populate('crew');

    res.json(job.toObject());
  } catch (e) {
    console.log(`Can't retrieve job information: ${e.stack}`);
    res.json({});
  }
});

router.get('/upload', async (req, res) => {
  res.send('Jobs is being uploaded');
  try {
    await uploadJobs();
  } catch (e) {
    console.log('Error while uploading jobs:', e.stack);
  }
  console.log('Job uploading: operation completed')
});
