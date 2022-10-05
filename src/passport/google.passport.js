const passport = require('passport');
const { signupWithGoogle, findOneUser } = require('../models/auth.model');
const knex = require('../knex/knex-config');

const AUTH_OPTIONS = {
  callbackURL: `${process.env.API_BASE_URL}/auth/google/callback`,
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}

async function verifyCallback (accessToken, refreshToken, profile, done) {
  console.log('veryfing signing in with google...');
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
    const newUser = await signupWithGoogle(knex, userData);
    done(null, newUser[0].userId);
  }
  //console.log('google profile: ', profile);
}

module.exports = {
  AUTH_OPTIONS,
  verifyCallback
}
