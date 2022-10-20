const bcrypt = require('bcrypt');
const passport = require('passport');

const { ValidationError } = require('../../errors/api-errors');
const { formatDbResponse } = require('../../utils/utility-functions');
const { AuthenticationError, DuplicateEntityError } = require('../../errors/db-errors');

const { 
  signup,
  findOneUser,
} = require('../../models/auth.model');
const { postListing } = require('../../models/listings.model');
const { 
  signinValidationSchema,
  signupValidationSchema
} = require('../../joi/auth-validation.schema');

const { generateDummyListing, generateGuestUser } = require('../../service/guest-generator');

function getPassportMiddleware (userType, next) {
  return passport.authenticate(
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
        userType,
      }
      req.login(userIdentifier, next);
      return res.status(200).json(user);
    }
  )
}

function httpSignin () {
  return (req, res, next) => {
    const { email, password, userType } = req.body;
    const t = req.t;
    try {
      const { error } = signinValidationSchema(req.t).validate({ email, password }, { abortEarly: false });
      if (error) throw new ValidationError('there is an error when validating user input', error.details);
      getPassportMiddleware(userType, next)(req, res, next);
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

      const signupResponse = await signup(req.knexInstance, signupData, req.t);
      console.log('signupResponse: ', signupResponse);
      return res.status(200).json({ ...signupResponse, userType: 'normal' });
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

function httpGetUser (knex) {
  return async (req, res, next) => {
    if (req.user) {
      try {
        const dbUser = await findOneUser(knex, req.user);
        console.log('dbUser', dbUser)
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

function httpGetGuest (knex) {
  return async (req, res) => {
    const signupData = await generateGuestUser();
    const t = req.t;
    const clientLang = req.headers["accept-language"];
    const signupResponse = await signup(req.knexInstance, signupData, req.t);
    return res.status(200).json({ ...signupResponse, userType: 'guest' });

    //const listingData = await generateDummyListing();
    //const listing = await postListing(knexGuest, { userid }, listingData, t, clientLang);
    //console.log('guest user:', user);
    //console.log('listing:', listing);
    //res.status(200).json('guest generated succesfully!');
  }
}

module.exports = {
  httpSignin,
  httpSignup,
  httpSignout,
  httpSigninWithGoogle,
  httpGetUser,
  httpGetGuest,
}
