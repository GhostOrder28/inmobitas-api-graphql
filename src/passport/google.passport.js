const passport = require('passport');
const { apiBaseUrl } = require('../constants/urls');
const { signupWithGoogle, findOneUser } = require('../models/auth.model');
const knex = require('../knex/knex-config');

const AUTH_OPTIONS = {
  callbackURL: `${apiBaseUrl}/auth/google/callback`,
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}

async function verifyCallback (accessToken, refreshToken, profile, done) {
  console.log('sinning in with google...');
  let user;
  const userData = {
    oAuthId: profile.id,
    names: profile._json.name,
    email: profile._json.email
  }
  const dbUser = await findOneUser(knex, userData.oAuthId, true);
  if (dbUser.length) {
    done(null, dbUser[0].user_id);
  } else {
    console.log('user is not registered');
    const newUser = await signupWithGoogle(knex, user);
    done(null, newUser[0].user_id);
  }
  //console.log('google profile: ', profile);
}

module.exports = {
  AUTH_OPTIONS,
  verifyCallback
}
