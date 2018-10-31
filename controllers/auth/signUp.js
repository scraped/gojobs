const {validate} = require('../../validators');

const {User} = require('../../models');

exports.signUpPost = async (req, res, next) => {
  const {username, password, email} = req.body;

  if (!validate('username', username)) {
    return next(res.error.forbidden('Incorrect username'));
  }

  if (!validate('password', password)) {
    return next(res.error.forbidden('Incorrect password'));
  }

  if (!validate('email', email)) {
    return next(res.error.forbidden('Incorrect email'));
  }

  const user = await User.findOne({username});

  if (!user) {
    return next(res.error.forbidden('Unfortunately you cannot register at this time'));
  }

  if (user.verified) {
    return next(res.error.forbidden('This user has already been registered'));
  }

  if (email) {
    const userWithSuchEmail = await User.findOne({email});

    if (userWithSuchEmail) {
      return next(res.error.forbidden('This email is already taken'));
    }
  }

  const jobname = User.generateTestJobName();
  const date = Date.now() + 60 * 60 * 1000;

  const jwtSigned = jwt.sign({username, password, email, jobname, date}, config.jwtSecret, {
    expiresIn: '1h',
  });

  const setCookie = cookie.serialize('jwt', jwtSigned, {
    httpOnly: true,
    // 1 hour
    maxAge: 60 * 60,
    path: '/',
  });

  res.set('Set-Cookie', setCookie);

  return res.json({
    message: 'Success! Go to your profile and verify your account.',
    jobname,
    date,
  });
};
