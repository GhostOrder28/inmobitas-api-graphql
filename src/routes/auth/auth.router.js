const express = require('express');
const passport = require('passport');
const rateLimit = require('express-rate-limit');

const knex = require('../../knex/knex-config');
const { 
  httpSignup,
  httpSignin,
  httpSignout,
  httpSigninWithGoogle, 
  httpGetUser,
  httpLimitHandler
} = require('./auth.controller');
const { checkUserType } = require('../../middlewares/user-type.middlewares');

const apiLimiter = rateLimit({
	windowMs: 30 * 60 * 1000,
	max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: httpLimitHandler,
})

const authRouter = express.Router();
authRouter.post('/signup/:usertype', checkUserType, httpSignup());
authRouter.get('/signup/:usertype/:tzOffset', apiLimiter, checkUserType, httpSignup());
authRouter.post('/signin/:usertype', checkUserType, httpSignin());
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failure',
    session: true,
  }),
  httpSigninWithGoogle(knex)
);
authRouter.get('/getuser', checkUserType, httpGetUser(knex));
authRouter.get('/signout', httpSignout());

module.exports = authRouter;
