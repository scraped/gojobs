const Boom = require('boom');
const {Job, User, Crew} = require('../../models');

exports.jobDetailsPost = async (req, res) => {
  const {id: jobId} = req.params;

  const job = await Job.findOne({jobId});

  if (!job) {
    return res.send(Boom.notFound('Job not found'));
  }

  let authorCrew;

  if (job.author) {
    const authorInfo = await User.findOne({username: job.author});

    if (authorInfo && authorInfo.crew) {
      const crewInfo = await Crew.findOne({slug: authorInfo.crew});

      if (crewInfo) {
        authorCrew = crewInfo;
      }
    }
  }

  let response = {job};

  if (authorCrew) {
    response.crew = authorCrew;
  }

  return res.json(response);
};
