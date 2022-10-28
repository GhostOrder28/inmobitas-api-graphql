const bcrypt = require('bcrypt');
const passport = require('passport');

const { ValidationError } = require('../../errors/api-errors');
const { formatDbResponse } = require('../../utils/utility-functions');
const { AuthenticationError, DuplicateEntityError } = require('../../errors/db-errors');

const { signup, findOneUser } = require('../../models/auth.model');
const { 
  signinValidationSchema,
  signupValidationSchema
} = require('../../joi/auth-validation.schema');

const { 
  generateGuestUser, 
  populateGuestData,
} = require('../../service/guest-generator');

function httpLimitHandler (req, res, next) {
  const { t } = req;
  return res.status(429).json({ limitReachedError: t('rateLimit') })
}

function httpSignin () {
  return (req, res, next) => {
    const { email, password } = req.body;
    const { usertype } = req.params;
    const { t } = req;
    try {
      const { error } = signinValidationSchema(t).validate({ email, password }, { abortEarly: false });
      if (error) throw new ValidationError('there is an error when validating user input', error.details);
      passport.authenticate(
        'local',
        {
          failureRedirect: '/failure',
          session: true
        },
        function (err, user, info) {
          if (err) throw new Error(err);
          if (info) return next(new AuthenticationError(info.message));
          if (!user) throw new Error('user is not defined');
          const userIdentifier = {
            userId: user.userId,
            userType: usertype,
          }
          req.login(userIdentifier, next);
          return res.status(200).json(user);
        }
      )(req, res, next);
    } catch (error) {
      if (error instanceof ValidationError) return next(error);
      throw new Error(`There is an error, ${error}`);
    }
  }
}

function httpSignup () {
  return async (req, res, next) => {
    try {
      let signupData;
      const { knexInstance, t } = req;
      const { usertype, tzOffset } = req.params;
      const clientLang = req.headers["accept-language"];
      
      if (usertype === 'guest') {
        signupData = generateGuestUser();
      }
      if (usertype === 'normal') {
        signupData = req.body;
        const { error } = signupValidationSchema(t).validate(signupData, { abortEarly: false })
        if (error) throw new ValidationError('there is a validation error', error.details);
      } 

      const saltRounds = 10;
      signupData.hashedPwd = await bcrypt.hash(signupData.password, saltRounds);

      const signupResponse = await signup(knexInstance, signupData, t);
      const { email, password, userId } = signupResponse;
      if (usertype === 'guest') await populateGuestData(knexInstance, userId, t, clientLang, tzOffset);

      return res.status(200).json({ email, password, userId, userType: usertype });
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof DuplicateEntityError
      ) return next(error);
      throw new Error(`There is an error, ${error}`);
    }
  }
}

function httpSignout () {
  return async (req, res) => {
    //req.session = null;
    await req.logout();
    console.log('session: ', req.session);
    return res.send('success!');
  }
}

function httpSigninWithGoogle (knex) {
  return async (req, res) => {
    return res.redirect(process.env.CLIENT_BASE_URL);
  }
}

function httpGetUser () {
  return async (req, res, next) => {
    const { user, knexInstance, t } = req;
    console.log('user credentials: ', user)
    if (user) {
      try {
        const dbUser = await findOneUser(knexInstance, user.userId);
        if (!dbUser.length) throw new AuthenticationError(t('wrongCredentials'));
        return res.status(200).json(formatDbResponse(dbUser[0]));
      } catch (error) {
        if (error instanceof AuthenticationError) return next(error);
        throw new Error(`There is an error, ${error}`);
      }
    } else {
      return res.status(400).json({ error: 'there is not logged user yet!' }) // should this be an error?
    }
  }
}

module.exports = {
  httpSignin,
  httpSignup,
  httpSignout,
  httpSigninWithGoogle,
  httpGetUser,
  httpLimitHandler,
}
