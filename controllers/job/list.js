const _ = require('lodash');
const platforms = require('../../config/static/platforms');
const Job = require('../../models/job');

module.exports = {
  jobListPost
};

const PER_PAGE_DEFAULT = 35;

async function jobListPost(req, res) {
  const { body, cookies } = req;

  const { by, rockstar, rockstarverified, user, type, mode } = body;

  const page = Number(body.page) || 1;
  const platform = body.platform || cookies.platform || 'pc';

  let conditions = {};
  let sort = {};

  switch (by) {
    case 'rating':
      sort = { 'stats.likes': -1 };
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

    case 'growth':
      sort = { 'stats.growth': -1 };
      break;

    default:
      sort = { 'stats.trend': -1 };
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
      .skip((page - 1) * PER_PAGE_DEFAULT)
      .limit(PER_PAGE_DEFAULT)
      .sort(sort);

    res.json({
      number: jobsNumber,
      jobs
    });

  } catch (error) {
    console.log(error);
    res.json({
      message: 'Error occured'
    });
  }
}
