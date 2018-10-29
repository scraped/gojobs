const User = require('../../../models');

module.exports = async job => {
  const {
    rockstarId: userId,
    nickname: username,
    crewId,
  } = job.data.userInfo;

  const user = await User.findOne({username});

  const newUserInfo = {
    username,
    userId,
    crewId,
  };

  if (user) {
    user.set(newUserInfo);
  }

  return await (user || new User(newUserInfo)).save();
};
