const {User} = require('../../../models');

module.exports = async job => {
  const {
    username,
    userId,
    crewSlug,
  } = job.data;

  const user = await User.findOne({username});

  const newUserInfo = {
    username,
    userId,
    crew: crewSlug,
  };

  if (user) {
    user.set(newUserInfo);
  }

  const userDoc = await (user || new User(newUserInfo)).save();

  return {userDoc};
};
