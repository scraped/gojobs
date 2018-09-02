// const _ = require('lodash');
// const {platforms} = require('../../config/static');
const {Job, RawJob} = require('../../models');

const PER_PAGE_DEFAULT = 35;

exports.rawJobsListPost = async function rawJobsListPost(req, res) {
  const {body} = req;

  const page = Number(body.page) || 1;
  // const processed = !!body.processed;
  // const uploaded = !!body.uploaded;

  const jobs = await RawJob.find()
    .skip((page - 1) * 50)
    .limit(50)
    .sort({
      'lastFetch': 'desc'
    });

  return res.send({
    jobs
  });
};

exports.jobListPost = async function jobListPost(req, res) {
  const { body, cookies } = req;

  const { by, rockstar, rockstarverified, user } = body;

  const type = Number(body.type);
  const mode = Number(body.mode);
  const page = Number(body.page) || 1;
  const perPage = PER_PAGE_DEFAULT;
  const platform = body.platform || cookies.platform || 'pc';

  let conditions = {};
  let sort = {};

  switch (by) {
    case 'rating':
      sort = { 'stats.like': -1 };
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
    // conditions.platform = 1 + _.findIndex(platforms, plat => {
    //   return plat.short === platform;
    // });
  }

  const count = Object.keys(conditions).length
    ? await Job.countDocuments(conditions)
    : await Job.estimatedDocumentCount();

  try {
    const jobs = await Job.find(conditions)
      // .select('-_id')
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort(sort);

    res.json({
      count,
      jobs
    });

  } catch (error) {
    console.log(error);
    res.json({
      message: 'Error occured'
    });
  }
}
