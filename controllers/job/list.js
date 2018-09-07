const clamp = require('lodash/clamp');
const {Job, RawJob} = require('../../models');
const {platforms} = require('../../config/static');

exports.rawJobsListPost = async (req, res) => {
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

exports.jobListPost = async (req, res) => {
  const MIN_PER_PAGE = 10;
  const MAX_PER_PAGE = 100;
  const PER_PAGE_DEFAULT = 30;
  const DEFAULT_PLATFORM = 'pc';

  const {body, cookies} = req;

  // Page
  const page = Math.abs(Number(body.page)) || 1;

  // Per page
  const perPage = Number(body.perPage)
    ? clamp(Number(body.perPage), MIN_PER_PAGE, MAX_PER_PAGE)
    : PER_PAGE_DEFAULT;

  // Platform
  let platform = body.platform || cookies.platform || DEFAULT_PLATFORM;

  if (!Object.keys(platforms).includes(platform)) {
    platform = DEFAULT_PLATFORM;
  }

  const {
    type: jobType,
    mode: jobMode,
    user,
    rockstar,
    by
  } = body;

  let conditions = {};
  let sort = {};

  switch (by) {
    case 'rating':
      sort = {'stats.like': -1};
      break;

    case 'updated':
      sort = {'scUpdated': -1};
      break;

    case 'featured':
      conditions.star = true;
      break;

    case 'newest':
      sort = {scAdded: -1};
      break;

    case 'growth':
      sort = {'stats.growth': -1};
      break;

    default:
      sort = {'stats.trend': -1};
  }

  if (user) {
    conditions.author = user;
  }

  if (jobType && jobType !== 'any') {
    conditions.scType = jobType;
  }

  if (jobMode && jobType !== 'any') {
    conditions.scMode = jobMode;
  }

  if (rockstar) {
    if (!user) {
      conditions.author = {$exists: false};
    }
    conditions.rockstar = true;
  } else {
    conditions.plat = platform;
  }

  const count = Object.keys(conditions).length
    ? await Job.countDocuments(conditions)
    : await Job.estimatedDocumentCount();

  const jobs = await Job.find(conditions)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort(sort);

  res.json({
    count,
    jobs
  });
}
