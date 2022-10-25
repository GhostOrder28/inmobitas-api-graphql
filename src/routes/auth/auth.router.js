const express = require('express');
const passport = require('passport');

const knex = require('../../knex/knex-config');
const { 
  httpSignup,
  httpSignin,
  httpSignout,
  httpSigninWithGoogle, 
  httpGetUser,
} = require('./auth.controller');
const { checkUserType } = require('../../middlewares/user-type.middlewares');

const authRouter = express.Router();
authRouter.post('/signup/:usertype', checkUserType, httpSignup());
authRouter.get('/signup/:usertype', checkUserType, httpSignup());
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
