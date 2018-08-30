const {User} = require('../models');

exports.profileDetails = async (req, res) => {
  const {username} = req.params;

  const user = await User.findOne({ username })
    .populate('crew', 'name slug tag color -_id');

  if (!user) {
    return res.json();
  }

  const { crew } = user;

  return res.json({ username, crew });
};
