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

const authRouter = express.Router();

authRouter.post('/signup', httpSignup(knex));
authRouter.post('/signin', httpSignin());
authRouter.get('/google', (req, res) => { console.log('signing with google...') }, passport.authenticate('google', { scope: ['profile', 'email'] }));
//authRouter.get('/google', (req, res) => { console.log('signin with google!'); });
authRouter.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failure',
    session: true,
  }),
  httpSigninWithGoogle(knex)
);
authRouter.get('/getuser', httpGetUser(knex));
authRouter.get('/signout', httpSignout());

module.exports = authRouter;
