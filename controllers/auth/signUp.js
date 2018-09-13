const joi = require('joi');
const Boom = require('boom');

const {User} = require('../../models');

exports.signUpPost = async (req, res, next) => {
  // const NO_USERNAME_MESSAGE = 'Please enter your login and password',
  //   USER_NOT_FOUND_MESSAGE = 'User not found: registration is not open for everybody as of now',
  //   USER_EXISTS_MESSAGE = 'This user has already registred',
  //   LENGTH_ISSUE_MESSAGE = 'Too short or too long username or/and password',
  //   INCORRECT_EMAIL_MESSAGE = 'Email doesn\'t seem to be correct',
  //   EMAIL_USED_MESSAGE = 'This email is already used by another user';

  // const MIN_USERNAME_LEN = 6,
  //   MAX_USERNAME_LEN = 16,
  //   MIN_PASSWORD_LEN = 6,
  //   MAX_PASSWORD_LEN = 30;

  // const { username, password, email } = req.body;

  // if (!username || !password) {
  //   return res.status(403).json({ message: NO_USERNAME_MESSAGE });
  // }

  // if (!_.inRange(username.length, MIN_USERNAME_LEN, MAX_USERNAME_LEN + 1)
  // || !_.inRange(password.length, MIN_PASSWORD_LEN, MAX_PASSWORD_LEN + 1)) {
  //   return res.status(403).json({ message: LENGTH_ISSUE_MESSAGE });
  // }

  // const user = await User.findOne({ username });

  // if (!user) {
  //   return next(Boom.forbidden(USER_NOT_FOUND_MESSAGE));
  //   // return res.status(403).json({ message: USER_NOT_FOUND_MESSAGE });
  // }

  // if (user.verified) {
  //   return res.status(403).json({ message: USER_EXISTS_MESSAGE });
  // }

  // if (email) {
  //   if (!validator.isEmail(email)) {
  //     return res.status(403).json({ message: INCORRECT_EMAIL_MESSAGE });
  //   }

  //   const userWithSuchEmail = await User.findOne({ email });

  //   if (userWithSuchEmail) {
  //     return res.status(403).json({ message: EMAIL_USED_MESSAGE });
  //   }
  // }

  // const jobname = User.generateTestJobName(),
  //   date = Date.now() + 60 * 60 * 1000;

  // const jwtSigned = jwt.sign(
  //   { username, password, email, jobname, date },
  //   config.jwtSecret,
  //   { expiresIn: '1h' }
  // );

  // const setCookie = cookie.serialize('jwt', jwtSigned, {
  //   httpOnly: true,
  //   // 1 hour
  //   maxAge: 60 * 60,
  //   path: '/'
  // });

  // res.set('Set-Cookie', setCookie);

  // return res.json({
  //   message: 'Success! Go to your profile and verify your account.',
  //   jobname,
  //   date
  // });
};
