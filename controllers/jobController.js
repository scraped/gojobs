const mongoose = require('../lib/db');
const uploadJobs = require('../lib/upload-jobs');
const Job = require('../models/job');
const Crew = require('../models/crew');
const User = require('../models/user');

module.exports = {
  async jobList(req, res) {
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

    let amount = 0;
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
      if (info) options.author = mongoose.Types.ObjectId(info._id);
    } else if (by === 'crew') {
      let info = await Crew.findOne({ crewUrl: byId });
      if (!info) empty = true;
      if (info) options.crew = mongoose.Types.ObjectId(info._id);
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
      .sort(sort)
      .populate('author')
      .populate('crew');

    jobs = jobs.map(job => job.toObject());

    res.json({ amount, jobs });
  },

  async jobDetails(req, res) {
    const { id } = req.params;

    const job = await Job.findOne({ jobId: id })
      .populate('author')
      .populate('crew');

    res.send(job.toObject());
  },

  async jobUpload(req, res) {
    const { amount, errors } = await uploadJobs();

    res.send(`${amount - errors}/${amount} jobs has been successfully uploaded.`);
  }
};
