const Joi = require('joi');
const Boom = require('boom');
const Crew = require('../models/crew');
const {fetchQueue} = require('../lib/queue');

exports.crewListPost = async (req, res) => {
  const CREWS_PER_PAGE = 100;

  const page = Number(req.body) || 1;

  const crews = await Crew.find()
    .skip((page - 1) * CREWS_PER_PAGE)
    .limit(CREWS_PER_PAGE)
    .sort({
      lastInfoFetch: 'desc'
    });

  res.json({crews});
};

exports.fetchCrewPost = async (req, res, next) => {
  const {slug} = req.body;

  const schema = Joi.string().token().min(3).max(30).required();

  const {error} = Joi.validate(slug, schema);

  if (error) {
    return next(Boom.badRequest('Incorrect slug'));
  }

  const sameJob = await fetchQueue.getJob(slug);

  if (sameJob !== null) {
    return next(Boom.badRequest('Whoops, this crew is being fetched still.'))
  }

  fetchQueue.add(
    'fetchCrewInfo',
    {
      slug
    },
    {
      jobId: slug
    }
  );

  res.json({
    message: 'Crew info will be fetched very shortly.'
  });
};
