const User = require('../models/user');

exports.profileDetails = async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  if (!user) {
    return res.json();
  }

  return res.json({ username });
};
