const Boom = require('boom');
const {User, Crew} = require('../models');

exports.profileDetails = async (req, res) => {
  const {username} = req.params;

  const user = await User.findOne({username});

  if (!user) {
    return res.send(Boom.notFound('User not found'));
  }

  let userCrew;

  if (user.crew) {
    const crewInfo = await Crew.findOne({slug: user.crew});

    if (crewInfo) {
      userCrew = crewInfo;
    }
  }

  let response = {user};

  if (userCrew) {
    response.crew = userCrew;
  }

  return res.send(response);
};
