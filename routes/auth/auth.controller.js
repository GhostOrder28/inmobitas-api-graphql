const bcrypt = require('bcrypt');
const passport = require('passport');

const { ValidationError } = require('../../errors/api-errors');
const { formatDbResponse } = require('../../utils/utility-functions');
const { AuthenticationError, DuplicateEntityError } = require('../../errors/db-errors');
const { clientBaseUrl } = require('../../constants/urls');

const { 
  signup,
  findOneUser,
  signupWithGoogle,
} = require('../../models/auth.model');
const { 
  signinValidationSchema,
  signupValidationSchema
} = require('../../joi/auth-validation.schema');


function httpSignin () {
  return (req, res, next) => {
    const { email, password } = req.body;
    try {
      const { error } = signinValidationSchema.validate({ email, password }, { abortEarly: false });
      if (error) throw new ValidationError('there is an error when validating user input', error.details);

      passport.authenticate(
        'local',
        {
          failureRedirect: '/failure',
          session: true
        },
        function (err, user, info) {
          if (info) return next(new AuthenticationError(info.message));
          req.login(user.userId, next);
          return res.status(200).json(user);
        }
      )(req, res, next);
    } catch (error) {
      if (error instanceof ValidationError) return next(error);
      throw new Error(`There is an error, ${error}`);
    }
  }
}

function httpSignup (knex) {
  return async (req, res, next) => {
    const signupData = req.body;

    try {
      const { error } = signupValidationSchema(req.t).validate(signupData, { abortEarly: false })
      if (error) throw new ValidationError('there is a validation error', error.details);

      const saltRounds = 10;
      signupData.hashedPwd = await bcrypt.hash(signupData.password, saltRounds);

      const signupResponse = await signup(knex, signupData, req.t);
      console.log('signupResponse: ', signupResponse);
      return res.status(200).json(signupResponse);
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
    await req.logout();
    return res.send('success!');
  }
}

function httpSigninWithGoogle (knex) {
  return async (req, res) => {
    console.log('sinning in with google...')
    const dbUser = await findOneUser(knex, req.user.oAuthId);
    if (dbUser.length) {
      console.log('user is already registered');
      console.log('host: ', req.get('host'));
      console.log('url: ', req.url);
      console.log('forwarded-prop header: ', req.headers['x-forwarded-proto']);
      return res.redirect(`/`)
      //return res.redirect(`${clientBaseUrl}/signin`)
    } else {
      console.log('user is not registered');
      const user = await signupWithGoogle(knex, req.user);
      return res.redirect(`${clientBaseUrl}/signin`)
    }
  }
}

function httpGetUser (knex) {
  return async (req, res, next) => {
    if (req.user) {
      try {
        const dbUser = await findOneUser(knex, req.user.oAuthId);
        if (!dbUser.length) throw new AuthenticationError(req.t('wrongCredentials'));
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
}
