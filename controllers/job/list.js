const _ = require('lodash');
const platforms = require('../../config/static/platforms');
const Job = require('../../models/job');

exports.jobListPost = jobListPost;

async function jobListPost(req, res) {
  const { body, cookies } = req;

  const { by, rockstar, rockstarverified, user, type, mode } = body;

  const page = Number(body.page) || 1;
  const platform = body.platform || cookies.platform || 'pc';

  let conditions = {};
  let sort = {};

  switch (by) {
    case 'rating':
      sort = { 'stats.points': -1 };
      break;

    case 'updated':
      sort = { 'scUpdated': -1 };
      break;

    case 'featured':
      conditions.star = true;
      break;

    case 'newest':
      sort = { scAdded: -1 };
      break;

    default:
      sort = { 'stats.growth': -1 };
  }

  if (user) {
    conditions.author = user;
  }

  if (type) {
    conditions.scType = type;
  }

  if (mode) {
    conditions.scMode = mode;
  }

  if (rockstar || rockstarverified) {
    conditions.rockstar = true;
    conditions.author = { $exists: Boolean(rockstarverified) };
  } else {
    conditions.platform = 1 + _.findIndex(platforms, plat => {
      return plat.short === platform;
    });
  }

  const jobsNumber = await Job.count(conditions);

  try {
    const jobs = await Job
      .find(conditions)
      .select('-_id -details')
      .skip((page - 1) * 30)
      .limit(30)
      .sort(sort);

    res.json({
      number: jobsNumber,
      jobs
    });

  } catch (error) {
    console.log(error);
    res.json('ашыпка111!');
  }

  // options.platform = platformId;
  // if (gameType) options['job.gameType'] = gameType;
  // if (maxpl) options['job.maxpl'] = { $lte: maxpl };

  // let number = 0;
  // let empty = false;
  // let sort = { 'stats.points': -1 };

  // if (by === 'featured') {
  //   options.starred = true;
  // } else if (by === 'updated') {
  //   sort = { 'dates.updated': -1 };
  // } else if (by === 'added') {
  //   sort = { 'dates.added': -1 };
  // } else if (by === 'user') {
  //   let info = await User.findOne({ username: byId });
  //   if (!info) empty = true;
  //   if (info) options.author = byId;
  // } else if (by === 'crew') {
  //   let info = await Crew.findOne({ crewUrl: byId });
  //   if (!info) empty = true;
  //   if (info) options.crew = mongoose.Types.ObjectId(info._id);
  // }

  // if (!empty) {
  //   number = await Job.count(options);
  //   if (!number) empty = true;
  // }

  // if (empty) {
  //   return res.json({ number: 0 });
  // }

  // let jobs = await Job.find(options)
  //   .skip(Math.abs((page - 1) * perPage))
  //   .limit(perPage)
  //   .sort(sort);

  // jobs = jobs.map(job => job.toObject());

  // res.json({ number, jobs });
}
